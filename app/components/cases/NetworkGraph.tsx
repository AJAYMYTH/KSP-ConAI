import React, { useState, useEffect } from 'react';
import { getCaseGraph } from '../../lib/api';
import type { GraphData } from '../../types';
import { Shield, HelpCircle, User, ArrowRight, UserCheck } from 'lucide-react';

interface Props {
  caseId: string;
}

export default function NetworkGraph({ caseId }: Props) {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    async function loadGraph() {
      setLoading(true);
      try {
        const data = await getCaseGraph(caseId);
        setGraphData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadGraph();
  }, [caseId]);

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-circle border-4 border-hairline-soft border-t-primary animate-spin" />
        <span className="text-xs text-steel font-bold">Mapping relationship clusters…</span>
      </div>
    );
  }

  if (!graphData || graphData.nodes.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-steel font-bold">
        No relational network maps registered for this case.
      </div>
    );
  }

  // Basic node positioning algorithm for SVG layout
  // Center is the current case node. Others are arranged in concentric rings.
  const width = 600;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;

  const nodePositions: Record<string, { x: number; y: number }> = {};
  
  // Find central case node
  const centerNode = graphData.nodes.find(n => n.id === caseId) || graphData.nodes[0];
  nodePositions[centerNode.id] = { x: centerX, y: centerY };

  // Position surrounding nodes
  const surroundingNodes = graphData.nodes.filter(n => n.id !== centerNode.id);
  const radius = 150;
  
  surroundingNodes.forEach((node, idx) => {
    const angle = (idx * 2 * Math.PI) / surroundingNodes.length;
    nodePositions[node.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

  const getConnectedEdges = (nodeId: string) => {
    return graphData.edges.filter(e => e.source === nodeId || e.target === nodeId);
  };

  const isConnected = (nodeId: string) => {
    if (!selectedNode) return true;
    if (nodeId === selectedNode) return true;
    return graphData.edges.some(
      e => (e.source === selectedNode && e.target === nodeId) || 
           (e.target === selectedNode && e.source === nodeId)
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="bg-surface-soft/40 border border-hairline-soft p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between text-xs">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-circle bg-primary" /> Case Node</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-circle bg-attention" /> Accused</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-circle bg-success" /> Complainant/Victim</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-circle bg-ink-deep" /> Station</div>
        </div>
        <div className="text-[10px] text-steel font-medium">
          Click any node to isolate relationships. Double click history cases to open file.
        </div>
      </div>

      <div className="relative border border-hairline-soft rounded-xxxl bg-canvas overflow-hidden flex items-center justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-3xl h-auto">
          {/* Draw Link Edges */}
          {graphData.edges.map((edge, idx) => {
            const from = nodePositions[edge.source];
            const to = nodePositions[edge.target];
            if (!from || !to) return null;

            const isEdgeHighlighted = !selectedNode || edge.source === selectedNode || edge.target === selectedNode;

            return (
              <g key={idx} className="transition-opacity duration-200">
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={isEdgeHighlighted ? 'var(--color-ink-deep)' : 'var(--color-hairline)'}
                  strokeWidth={isEdgeHighlighted ? 1.5 : 0.75}
                  strokeDasharray={edge.relationship === 'accused_in' ? '0' : '4,4'}
                  opacity={isEdgeHighlighted ? 0.7 : 0.25}
                />
                {/* Edge Label */}
                {isEdgeHighlighted && (
                  <text
                    x={(from.x + to.x) / 2}
                    y={(from.y + to.y) / 2 - 4}
                    fill="var(--color-steel)"
                    fontSize={8}
                    fontWeight="bold"
                    textAnchor="middle"
                    className="select-none bg-canvas"
                  >
                    {edge.relationship.replace('_', ' ')}
                  </text>
                )}
              </g>
            );
          })}

          {/* Draw Nodes */}
          {graphData.nodes.map((node) => {
            const pos = nodePositions[node.id];
            if (!pos) return null;

            const isNodeActive = isConnected(node.id);
            const isCenter = node.id === caseId;

            let color = 'var(--color-stone)';
            if (node.type === 'case') color = 'var(--color-primary)';
            else if (node.type === 'accused') color = 'var(--color-attention)';
            else if (node.type === 'victim') color = 'var(--color-success)';
            else if (node.type === 'station') color = 'var(--color-ink-deep)';

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => handleNodeClick(node.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNodeClick(node.id);
                  }
                }}
                onDoubleClick={() => {
                  if (node.type === 'case' && !isCenter) {
                    window.location.href = `/cases/${node.id}`;
                  }
                }}
                className="cursor-pointer focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                opacity={isNodeActive ? 1 : 0.2}
                role="button"
                tabIndex={0}
                aria-label={`${node.label} (${node.type})`}
              >
                {/* Outer halo */}
                <circle
                  r={isCenter ? 24 : 16}
                  fill={color}
                  opacity={isCenter ? 0.15 : 0.1}
                  className="transition transform hover:scale-125 duration-150"
                />
                {/* Core node */}
                <circle
                  r={isCenter ? 14 : 10}
                  fill={color}
                  stroke="var(--color-canvas)"
                  strokeWidth={2}
                />
                {/* Inner Icon indicator */}
                {node.type === 'case' && (
                  <path d="M-3.5 -3.5 L3.5 -3.5 L3.5 3.5 L-3.5 3.5 Z" fill="var(--color-canvas)" transform="scale(0.8)" />
                )}
                {/* Text Label */}
                <text
                  y={isCenter ? 36 : 26}
                  fill="var(--color-ink-deep)"
                  fontSize={isCenter ? 10 : 8}
                  fontWeight={isCenter ? 'bold' : 'normal'}
                  textAnchor="middle"
                  className="select-none pointer-events-none"
                >
                  {node.label.length > 25 ? `${node.label.substring(0, 22)}…` : node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="p-4 bg-surface-soft border border-hairline-soft rounded-xl animate-in slide-in-from-bottom-2 duration-150">
          {(() => {
            const node = graphData.nodes.find(n => n.id === selectedNode);
            const connections = getConnectedEdges(selectedNode);
            if (!node) return null;

            return (
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-ink-deep">{node.label}</span>
                    <span className="text-[9px] uppercase tracking-wider bg-ink/10 text-ink px-2 py-0.5 rounded font-bold">
                      {node.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-steel">
                    Direct Connections: {connections.length} association{connections.length > 1 ? 's' : ''} resolved.
                  </p>
                </div>
                {node.type === 'case' && node.id !== caseId && (
                  <a
                    href={`/cases/${node.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 bg-primary text-canvas rounded-full text-[10px] font-bold hover:bg-primary-deep focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition cursor-pointer"
                  >
                    Load Case File <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </a>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
