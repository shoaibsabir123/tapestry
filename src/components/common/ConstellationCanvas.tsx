import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Memory, MemoryCategory } from '../../types';
import { CATEGORY_COLORS, formatDate } from '../../utils/theme';
import { ZoomIn, ZoomOut, RotateCcw, Filter, Sparkles } from 'lucide-react';

interface ConstellationCanvasProps {
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  selectedCategory?: string;
  searchFilter?: string;
  height?: number | string;
}

interface CanvasNode {
  memory: Memory;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glow: string;
}

export const ConstellationCanvas: React.FC<ConstellationCanvasProps> = ({
  memories,
  onSelectMemory,
  selectedCategory,
  searchFilter,
  height = 560
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Zoom & Pan transforms
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<{ node: CanvasNode; screenX: number; screenY: number } | null>(null);

  // Filter memories
  const filteredMemories = useMemo(() => {
    return memories.filter((m) => {
      if (selectedCategory && selectedCategory !== 'All' && m.category !== selectedCategory) {
        return false;
      }
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        return (
          m.title.toLowerCase().includes(q) ||
          m.location.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q)) ||
          m.people.some((p) => p.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [memories, selectedCategory, searchFilter]);

  // Persistent node positions
  const nodesRef = useRef<Map<string, CanvasNode>>(new Map());

  // Ambient background dust stars
  const ambientStarsRef = useRef<{ x: number; y: number; r: number; opacity: number; pulseSpeed: number }[]>([]);

  useEffect(() => {
    // Generate 75 subtle background stars
    const stars = [];
    for (let i = 0; i < 75; i++) {
      stars.push({
        x: Math.random() * 2000 - 500,
        y: Math.random() * 1400 - 300,
        r: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        pulseSpeed: Math.random() * 0.02 + 0.005
      });
    }
    ambientStarsRef.current = stars;
  }, []);

  // Initialize or update node positions organically
  useEffect(() => {
    const existing = nodesRef.current;
    const width = containerRef.current?.clientWidth || 900;
    const heightNum = typeof height === 'number' ? height : 560;

    filteredMemories.forEach((mem, index) => {
      const catColor = CATEGORY_COLORS[mem.category] || CATEGORY_COLORS.Other;
      const intensity = ((mem.emotionQuietElectric + mem.emotionHeavyLight) / 200);
      const radius = 8 + intensity * 10 + (mem.favorite ? 3 : 0);

      if (!existing.has(mem.id)) {
        // Place in soft spiral or organic constellation cluster
        const angle = index * 2.39996; // Golden angle
        const dist = 70 + Math.sqrt(index) * 110;
        const x = width / 2 + Math.cos(angle) * dist + (Math.random() - 0.5) * 40;
        const y = heightNum / 2 + Math.sin(angle) * dist * 0.75 + (Math.random() - 0.5) * 40;

        existing.set(mem.id, {
          memory: mem,
          x,
          y,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          radius,
          color: catColor.accent,
          glow: catColor.glow
        });
      } else {
        const node = existing.get(mem.id)!;
        node.memory = mem;
        node.radius = radius;
        node.color = catColor.accent;
        node.glow = catColor.glow;
      }
    });

    // Remove obsolete
    for (const key of Array.from(existing.keys())) {
      if (!filteredMemories.some((m) => m.id === key)) {
        existing.delete(key);
      }
    }
  }, [filteredMemories, height]);

  // Main render loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;

    const render = () => {
      tick++;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      ctx.save();

      // Apply zoom & pan
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.scale, transform.scale);

      // 1. Draw subtle ambient stars
      ambientStarsRef.current.forEach((star) => {
        const currentOpacity = star.opacity + Math.sin(tick * star.pulseSpeed) * 0.1;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 195, 185, ${Math.max(0.05, currentOpacity)})`;
        ctx.fill();
      });

      const nodes = Array.from(nodesRef.current.values());

      // 2. Draw Connection Threads (Links)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];

          // Check common tags, people, category, or chapter
          const commonPeople = a.memory.people.filter((p) => b.memory.people.includes(p));
          const commonTags = a.memory.tags.filter((t) => b.memory.tags.includes(t));
          const sameCat = a.memory.category === b.memory.category;
          const commonChapters = (a.memory.chapterIds || []).filter((c) =>
            (b.memory.chapterIds || []).includes(c)
          );

          let linkStrength = 0;
          let linkColor = 'rgba(160, 150, 140, 0.12)';

          if (commonPeople.length > 0) {
            linkStrength = 0.45;
            linkColor = 'rgba(182, 110, 111, 0.4)'; // warm rose
          } else if (commonChapters.length > 0) {
            linkStrength = 0.4;
            linkColor = 'rgba(200, 157, 60, 0.35)'; // gold
          } else if (commonTags.length > 0) {
            linkStrength = 0.3;
            linkColor = 'rgba(125, 107, 145, 0.3)'; // violet
          } else if (sameCat) {
            linkStrength = 0.18;
            linkColor = a.color + '26'; // faint category hue
          }

          if (linkStrength > 0) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = linkColor;
            ctx.lineWidth = linkStrength * 2.5;
            ctx.setLineDash(commonPeople.length > 0 ? [] : [4, 6]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }

      // 3. Draw Nodes with ethereal halos
      nodes.forEach((node) => {
        // Floating motion
        node.x += Math.sin(tick * 0.02 + node.radius) * 0.15;
        node.y += Math.cos(tick * 0.02 + node.radius) * 0.15;

        const isHovered = hoveredNode?.node.memory.id === node.memory.id;

        // Outer radial aura
        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          node.radius * 0.5,
          node.x,
          node.y,
          node.radius * (isHovered ? 3.5 : 2.5)
        );
        gradient.addColorStop(0, node.glow);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * (isHovered ? 3.5 : 2.5), 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core star node
        ctx.beginPath();
        ctx.arc(node.x, node.y, isHovered ? node.radius * 1.3 : node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = isHovered ? 18 : 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Center white gleam
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // Node title caption
        ctx.font = isHovered ? '600 13px "Plus Jakarta Sans"' : '400 11px "Plus Jakarta Sans"';
        ctx.textAlign = 'center';
        ctx.fillStyle = isHovered ? '#1E1B18' : 'rgba(80, 75, 70, 0.85)';
        ctx.fillText(node.memory.title, node.x, node.y + node.radius + 16);
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [transform, hoveredNode]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = typeof height === 'number' ? height : containerRef.current.clientHeight || 560;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [height]);

  // Coordinates helper
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { worldX: 0, worldY: 0, mouseX: 0, mouseY: 0 };
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    // Map through zoom and pan
    const worldX = (mouseX - transform.x) / transform.scale;
    const worldY = (mouseY - transform.y) / transform.scale;
    return { worldX, worldY, mouseX, mouseY };
  };

  // Find node under mouse
  const getNodeAt = (worldX: number, worldY: number): CanvasNode | null => {
    const nodes = Array.from(nodesRef.current.values());
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      const dx = worldX - node.x;
      const dy = worldY - node.y;
      if (Math.sqrt(dx * dx + dy * dy) <= node.radius + 10) {
        return node;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }));
    } else {
      const { worldX, worldY, mouseX, mouseY } = getCanvasCoords(e);
      const found = getNodeAt(worldX, worldY);
      if (found) {
        setHoveredNode({ node: found, screenX: mouseX, screenY: mouseY });
      } else {
        setHoveredNode(null);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { worldX, worldY } = getCanvasCoords(e);
    const found = getNodeAt(worldX, worldY);
    if (found) {
      onSelectMemory(found.memory);
    }
  };

  const zoomIn = () => {
    setTransform((prev) => ({ ...prev, scale: Math.min(2.5, prev.scale + 0.2) }));
  };

  const zoomOut = () => {
    setTransform((prev) => ({ ...prev, scale: Math.max(0.5, prev.scale - 0.2) }));
  };

  const resetView = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-[#FAF8F5] dark:bg-[#0D0F12] select-none"
      style={{ height }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsDragging(false);
          setHoveredNode(null);
        }}
        onClick={handleClick}
        className={`w-full h-full block ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      />

      {/* Control Buttons */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 p-1 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200 dark:border-stone-700 rounded-xl shadow-sm z-10">
        <button
          onClick={zoomIn}
          className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          aria-label="Zoom in constellation"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={zoomOut}
          className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          aria-label="Zoom out constellation"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={resetView}
          className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          aria-label="Reset constellation view"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Top Legend Badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md border border-stone-200/60 dark:border-stone-800 rounded-xl text-xs text-stone-600 dark:text-stone-400">
        <Sparkles size={14} className="text-amber-500" />
        <span>{filteredMemories.length} moments woven</span>
        <span className="text-stone-300 dark:text-stone-700">·</span>
        <span className="italic font-serif">Pan & click nodes to explore</span>
      </div>

      {/* Hover Card Tooltip */}
      {hoveredNode && (
        <div
          className="absolute pointer-events-none z-20 w-64 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-200 dark:border-stone-700 rounded-xl p-3 shadow-xl transition-opacity duration-200"
          style={{
            left: Math.min(hoveredNode.screenX + 16, (containerRef.current?.clientWidth || 800) - 275),
            top: Math.max(16, Math.min(hoveredNode.screenY - 40, (typeof height === 'number' ? height : 560) - 160))
          }}
        >
          {hoveredNode.node.memory.coverImageUrl && (
            <img
              src={hoveredNode.node.memory.coverImageUrl}
              alt=""
              className="w-full h-24 object-cover rounded-lg mb-2.5"
            />
          )}
          <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-1">
            <span style={{ color: hoveredNode.node.color }} className="font-medium">
              {hoveredNode.node.memory.category}
            </span>
            <span>·</span>
            <span>{formatDate(hoveredNode.node.memory.date)}</span>
          </div>
          <h4 className="font-serif text-sm font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">
            {hoveredNode.node.memory.title}
          </h4>
          <p className="text-xs text-stone-600 dark:text-stone-400 font-serif italic line-clamp-2 mt-1">
            “{hoveredNode.node.memory.story}”
          </p>
          <div className="mt-2 text-[10px] text-stone-400 text-right">
            Click to open memory
          </div>
        </div>
      )}
    </div>
  );
};
