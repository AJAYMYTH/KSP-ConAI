import React, { useState, useEffect } from 'react';
import { 
  ReactFlow, MiniMap, Controls, Background, 
  useNodesState, useEdgesState, MarkerType 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Shield, User, UserX, UserCheck, Eye, 
  MapPin, Phone, Car, Landmark, Building2, 
  FileText, ArrowLeft, RefreshCw, ZoomIn 
} from 'lucide-react';
import { getCaseGraph } from '../../lib/api';
import type { GraphData } from '../../types';
import { useI18n } from '../../i18n/hooks';

interface Props {
  caseId: string;
}

function getNodeStyle(type: string) {
  const base = {
    padding: '8px 12px',
    borderRadius: '12px',
    fontSize: '10px',
    fontWeight: '700',
    border: '2px solid',
    boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
    color: '#ffffff',
    textAlign: 'center' as const,
    minWidth: '120px',
    cursor: 'pointer'
  };
  switch (type) {
    case 'accused':
      return { ...base, background: '#e41e3f', borderColor: '#b91c1c' };
    case 'victim':
      return { ...base, background: '#31a24c', borderColor: '#16a34a' };
    case 'witness':
      return { ...base, background: '#f2a918', borderColor: '#d97706' };
    case 'station':
      return { ...base, background: '#0064e0', borderColor: '#1d4ed8' };
    case 'location':
      return { ...base, background: '#7c3aed', borderColor: '#6d28d9' };
    case 'phone':
      return { ...base, background: '#0d9488', borderColor: '#0f766e' };
    case 'vehicle':
      return { ...base, background: '#ea580c', borderColor: '#c2410c' };
    case 'bank':
      return { ...base, background: '#0891b2', borderColor: '#0e7490' };
    case 'organization':
      return { ...base, background: '#475569', borderColor: '#334155' };
    case 'case':
      return { ...base, background: '#0a1317', borderColor: '#000000' };
    default:
      return { ...base, background: '#64748b', borderColor: '#475569' };
  }
}

function getNodeIcon(type: string) {
  const className = "w-4 h-4";
  switch (type) {
    case 'accused': return <UserX className={className} />;
    case 'victim': return <UserCheck className={className} />;
    case 'witness': return <Eye className={className} />;
    case 'station': return <Shield className={className} />;
    case 'location': return <MapPin className={className} />;
    case 'phone': return <Phone className={className} />;
    case 'vehicle': return <Car className={className} />;
    case 'bank': return <Landmark className={className} />;
    case 'organization': return <Building2 className={className} />;
    case 'case': return <FileText className={className} />;
    default: return <User className={className} />;
  }
}

export default function CriminalNetworkGraph({ caseId }: Props) {
  const { currentLanguage } = useI18n();
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [graphDepth, setGraphDepth] = useState<1 | 2>(2);

  const fetchGraph = async () => {
    setLoading(true);
    setSelectedNode(null);
    try {
      const data = await getCaseGraph(caseId);
      setGraphData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, [caseId]);

  useEffect(() => {
    if (!graphData) return;

    const centerNodeId = caseId;
    const centerNode = graphData.nodes.find(n => n.id === centerNodeId) || graphData.nodes[0];
    
    const calculatedNodes: any[] = [];
    const calculatedEdges: any[] = [];

    // Center node position (Case center)
    calculatedNodes.push({
      id: centerNode.id,
      data: { label: centerNode.label, type: centerNode.type },
      position: { x: 300, y: 180 },
      style: getNodeStyle(centerNode.type)
    });

    const ring1Types = ['accused', 'victim', 'witness'];
    const ring1Nodes = graphData.nodes.filter(n => n.id !== centerNode.id && ring1Types.includes(n.type));
    const ring2Nodes = graphData.nodes.filter(n => n.id !== centerNode.id && !ring1Types.includes(n.type));

    // Ring 1 Concentric positioning (Radius 140)
    ring1Nodes.forEach((node, idx) => {
      const angle = (idx * 2 * Math.PI) / ring1Nodes.length;
      const x = 300 + 150 * Math.cos(angle);
      const y = 180 + 150 * Math.sin(angle);
      calculatedNodes.push({
        id: node.id,
        data: { label: node.label, type: node.type },
        position: { x: x - 60, y: y - 20 },
        style: getNodeStyle(node.type)
      });
    });

    // Ring 2 Concentric positioning (Radius 260) - only included when depth is 2 (Extended)
    if (graphDepth === 2) {
      ring2Nodes.forEach((node, idx) => {
        const angle = (idx * 2 * Math.PI) / ring2Nodes.length;
        const x = 300 + 260 * Math.cos(angle);
        const y = 180 + 260 * Math.sin(angle);
        calculatedNodes.push({
          id: node.id,
          data: { label: node.label, type: node.type },
          position: { x: x - 60, y: y - 20 },
          style: getNodeStyle(node.type)
        });
      });
    }

    // Connect concentric orbits with edges (only if both nodes exist in calculations)
    graphData.edges.forEach((edge, idx) => {
      const sourceExists = calculatedNodes.some(n => n.id === edge.source);
      const targetExists = calculatedNodes.some(n => n.id === edge.target);
      
      if (sourceExists && targetExists) {
        calculatedEdges.push({
          id: `edge-${idx}`,
          source: edge.source,
          target: edge.target,
          label: edge.relationship.replace('_', ' '),
          animated: edge.relationship === 'accused_in',
          style: { stroke: '#ced0d4', strokeWidth: 1.5 },
          labelStyle: { fill: 'var(--color-slate)', fontSize: 9, fontWeight: 'bold' },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 12,
            height: 12,
            color: '#ced0d4',
          },
        });
      }
    });

    setNodes(calculatedNodes);
    setEdges(calculatedEdges);
  }, [graphData, graphDepth]);

  const onNodeClick = (event: any, node: any) => {
    setSelectedNode(node);
  };

  const onNodeDoubleClick = (event: any, node: any) => {
    if (node.data?.type === 'case' && node.id !== caseId) {
      window.location.href = `/app/cases/detail.html?id=${encodeURIComponent(node.id)}`;
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-circle border-4 border-hairline-soft border-t-primary animate-spin" />
        <span className="text-xs text-steel font-bold">
          {currentLanguage === 'en' ? 'Formulating React Flow network orbits...' : 'ನೆಟ್‌ವರ್ಕ್ ಪ್ರಭಾವದ ವಲಯಗಳನ್ನು ರೂಪಿಸಲಾಗುತ್ತಿದೆ...'}
        </span>
      </div>
    );
  }

  if (!graphData || graphData.nodes.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-steel font-bold bg-canvas border border-hairline-soft rounded-2xl">
        {currentLanguage === 'en' ? 'No intelligence relational records mapped for this case.' : 'ಈ ಪ್ರಕರಣಕ್ಕೆ ಯಾವುದೇ ಸಂಬಂಧಿತ ದಾಖಲೆಗಳು ಮ್ಯಾಪ್ ಆಗಿಲ್ಲ.'}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Legend Header */}
      <div className="bg-surface-soft/40 border border-hairline-soft p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between text-[10px]">
        <div className="flex flex-wrap gap-3.5 font-bold">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-md bg-[#0a1317]" /> Case</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-md bg-[#e41e3f]" /> Accused</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-md bg-[#31a24c]" /> Victim</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-md bg-[#f2a918]" /> Witness</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-md bg-[#0064e0]" /> Station</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-md bg-[#7c3aed]" /> Location</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-md bg-[#0d9488]" /> Phone</div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="text-stone font-bold hidden md:block">
            {currentLanguage === 'en' 
              ? 'Drag to pan · Scroll to zoom · Double-click case node' 
              : 'ಪ್ಯಾನ್ ಮಾಡಲು ಎಳೆಯಿರಿ · ಜೂಮ್ ಮಾಡಲು ಸ್ಕ್ರಾಲ್ ಮಾಡಿ · ಡಬಲ್-ಕ್ಲಿಕ್ ಮಾಡಿ'}
          </div>
          
          {/* Depth Control Buttons */}
          <div className="flex items-center bg-canvas border border-hairline-soft rounded-full p-0.5 select-none font-bold">
            <button
              type="button"
              onClick={() => setGraphDepth(1)}
              className={`px-2.5 py-1 rounded-full text-[9px] transition cursor-pointer ${
                graphDepth === 1 ? 'bg-ink-deep text-canvas shadow-xs' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {currentLanguage === 'en' ? 'Direct (Ring 1)' : 'ನೇರ ಸಂಪರ್ಕ'}
            </button>
            <button
              type="button"
              onClick={() => setGraphDepth(2)}
              className={`px-2.5 py-1 rounded-full text-[9px] transition cursor-pointer ${
                graphDepth === 2 ? 'bg-ink-deep text-canvas shadow-xs' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {currentLanguage === 'en' ? 'Extended (Ring 2)' : 'ವಿಸ್ತೃತ ಜಾಲ'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Flow Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* React Flow Board */}
        <div className="lg:col-span-3 h-[420px] border border-hairline-soft bg-canvas rounded-xxxl shadow-xs overflow-hidden relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onNodeDoubleClick={onNodeDoubleClick}
            fitView
            maxZoom={1.5}
            minZoom={0.5}
          >
            <Controls showInteractive={false} />
            <MiniMap 
              nodeColor={(n) => getNodeStyle(n.data?.type as string).background}
              maskColor="rgba(0, 100, 224, 0.05)"
              className="border border-hairline-soft rounded-lg"
            />
            <Background color="#dee3e9" gap={16} size={1} />
          </ReactFlow>
        </div>

        {/* Selected Node Details Drawer */}
        <div className="lg:col-span-1 bg-canvas border border-hairline-soft p-5 rounded-xxxl shadow-xs flex flex-col justify-between min-h-[380px]">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2.5 border-b border-hairline-soft">
                <div className="p-2 rounded-xl text-white" style={{ background: getNodeStyle(selectedNode.data?.type).background }}>
                  {getNodeIcon(selectedNode.data?.type)}
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-stone font-bold">{selectedNode.data?.type}</span>
                  <h4 className="text-xs font-bold text-ink-deep">{selectedNode.data?.label}</h4>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-stone font-bold">{currentLanguage === 'en' ? 'Record Identifier' : 'ದಾಖಲೆ ಗುರುತು'}</span>
                  <p className="text-xs font-bold text-ink-deep font-mono truncate">{selectedNode.id}</p>
                </div>

                <div className="space-y-1 border-t border-hairline-soft/40 pt-2.5">
                  <span className="text-[9px] uppercase tracking-wider text-stone font-bold">{currentLanguage === 'en' ? 'Entity Status' : 'ಅಸ್ತಿತ್ವದ ಸ್ಥಿತಿ'}</span>
                  <p className="text-xs text-steel font-medium leading-relaxed">
                    {selectedNode.data?.type === 'case' 
                      ? (currentLanguage === 'en' ? 'Active database investigation file.' : 'ಸಕ್ರಿಯ ಪ್ರಕರಣ ತನಿಖಾ ದಾಖಲೆ.')
                      : (currentLanguage === 'en' ? 'Verified intelligence entity connected to ongoing case files.' : 'ತನಿಖಾ ಪ್ರಕರಣಗಳಿಗೆ ಸಂಬಂಧಿಸಿದ ಪರಿಶೀಲಿಸಿದ ದಾಖಲೆ.')}
                  </p>
                </div>
              </div>

              {selectedNode.data?.type === 'case' && selectedNode.id !== caseId && (
                <button
                  onClick={() => window.location.href = `/app/cases/detail.html?id=${encodeURIComponent(selectedNode.id)}`}
                  className="w-full mt-4 py-2 bg-primary hover:bg-primary-deep text-canvas text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  {currentLanguage === 'en' ? 'View Case File' : 'ಪ್ರಕರಣ ಪರಿಶೀಲಿಸಿ'} <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center gap-2 flex-1">
              <ZoomIn className="w-8 h-8 text-stone" />
              <span className="text-xs text-steel font-bold">
                {currentLanguage === 'en' ? 'Click any node to inspect relationship details.' : 'ಸಂಬಂಧಿತ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ಯಾವುದೇ ನೋಡ್ ಕ್ಲಿಕ್ ಮಾಡಿ.'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
