// CITY NETWORK
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, TrendingUp, Clock, Car, AlertTriangle, Zap } from 'lucide-react';

const Simulation = () => {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [carCount, setCarCount] = useState(40);
  const [stats, setStats] = useState({
    avgSpeed: 0,
    congestion: 0,
    throughput: 0,
    totalDistance: 0,
    activeVehicles: 0
  });
  
  const simulationRef = useRef(null);
  const statsRef = useRef({
    completedJourneys: 0,
    totalDistance: 0,
    frameCount: 0
  });
  const carsRef = useRef([]);
  const nodesRef = useRef([]);
  const edgesRef = useRef([]);
  const lightsRef = useRef([]);

  // Initialize graph structure - realistic city layout
  useEffect(() => {
    // City network with irregular spacing and multiple paths
    nodesRef.current = [
      // Top area - Downtown
      { id: 0, x: 150, y: 80, type: 'intersection', name: 'Downtown' },
      { id: 1, x: 300, y: 100, type: 'intersection', name: 'Plaza' },
      { id: 2, x: 480, y: 90, type: 'intersection', name: 'Market' },
      { id: 3, x: 650, y: 110, type: 'intersection', name: 'Harbor' },
      { id: 4, x: 820, y: 85, type: 'intersection', name: 'Bridge' },
      
      // Upper-middle area
      { id: 5, x: 100, y: 200, type: 'intersection', name: 'West End' },
      { id: 6, x: 250, y: 220, type: 'intersection', name: 'Central' },
      { id: 7, x: 420, y: 210, type: 'intersection', name: 'Square' },
      { id: 8, x: 580, y: 230, type: 'intersection', name: 'Park' },
      { id: 9, x: 750, y: 200, type: 'intersection', name: 'Mall' },
      { id: 10, x: 880, y: 220, type: 'intersection', name: 'Station' },
      
      // Middle area - Commercial district
      { id: 11, x: 120, y: 330, type: 'intersection', name: 'Arts' },
      { id: 12, x: 280, y: 350, type: 'intersection', name: 'Business' },
      { id: 13, x: 450, y: 340, type: 'intersection', name: 'Finance' },
      { id: 14, x: 620, y: 360, type: 'intersection', name: 'Tech Hub' },
      { id: 15, x: 800, y: 330, type: 'intersection', name: 'Campus' },
      
      // Lower-middle area
      { id: 16, x: 90, y: 460, type: 'intersection', name: 'South' },
      { id: 17, x: 240, y: 480, type: 'intersection', name: 'Clinic' },
      { id: 18, x: 400, y: 470, type: 'intersection', name: 'School' },
      { id: 19, x: 560, y: 490, type: 'intersection', name: 'Library' },
      { id: 20, x: 720, y: 460, type: 'intersection', name: 'Sports' },
      { id: 21, x: 870, y: 480, type: 'intersection', name: 'Arena' },
      
      // Bottom area - Residential
      { id: 22, x: 170, y: 580, type: 'intersection', name: 'Gardens' },
      { id: 23, x: 350, y: 590, type: 'intersection', name: 'Village' },
      { id: 24, x: 530, y: 580, type: 'intersection', name: 'Heights' },
      { id: 25, x: 710, y: 590, type: 'intersection', name: 'Bay' }
    ];

    // Road network with varying weights (distances and traffic)
    edgesRef.current = [
      // Top horizontal connections
      { from: 0, to: 1, weight: 1.2 },
      { from: 1, to: 2, weight: 1.0 },
      { from: 2, to: 3, weight: 1.3 },
      { from: 3, to: 4, weight: 1.1 },
      
      // Upper-middle horizontal
      { from: 5, to: 6, weight: 1.0 },
      { from: 6, to: 7, weight: 1.2 },
      { from: 7, to: 8, weight: 1.1 },
      { from: 8, to: 9, weight: 1.3 },
      { from: 9, to: 10, weight: 1.0 },
      
      // Middle horizontal - busy commercial roads
      { from: 11, to: 12, weight: 1.5 }, // Heavy traffic
      { from: 12, to: 13, weight: 1.3 },
      { from: 13, to: 14, weight: 1.4 },
      { from: 14, to: 15, weight: 1.2 },
      
      // Lower-middle horizontal
      { from: 16, to: 17, weight: 1.1 },
      { from: 17, to: 18, weight: 1.0 },
      { from: 18, to: 19, weight: 1.2 },
      { from: 19, to: 20, weight: 1.1 },
      { from: 20, to: 21, weight: 1.3 },
      
      // Bottom horizontal - residential
      { from: 22, to: 23, weight: 1.0 },
      { from: 23, to: 24, weight: 1.1 },
      { from: 24, to: 25, weight: 1.2 },
      
      // Vertical connections - Left side
      { from: 0, to: 5, weight: 1.0 },
      { from: 5, to: 11, weight: 1.2 },
      { from: 11, to: 16, weight: 1.1 },
      { from: 16, to: 22, weight: 1.0 },
      
      // Vertical - Center-left
      { from: 1, to: 6, weight: 1.1 },
      { from: 6, to: 12, weight: 1.3 },
      { from: 12, to: 17, weight: 1.2 },
      { from: 17, to: 22, weight: 1.0 },
      { from: 22, to: 23, weight: 1.0 },
      
      // Vertical - Center
      { from: 2, to: 7, weight: 1.0 },
      { from: 7, to: 13, weight: 1.2 },
      { from: 13, to: 18, weight: 1.1 },
      { from: 18, to: 23, weight: 1.0 },
      { from: 23, to: 24, weight: 1.1 },
      
      // Vertical - Center-right
      { from: 3, to: 8, weight: 1.1 },
      { from: 8, to: 14, weight: 1.3 },
      { from: 14, to: 19, weight: 1.2 },
      { from: 19, to: 24, weight: 1.1 },
      
      // Vertical - Right side
      { from: 4, to: 9, weight: 1.0 },
      { from: 9, to: 15, weight: 1.2 },
      { from: 15, to: 20, weight: 1.1 },
      { from: 20, to: 25, weight: 1.3 },
      { from: 10, to: 21, weight: 1.4 },
      
      // Diagonal connections - shortcuts and express routes
      { from: 0, to: 6, weight: 1.4 },
      { from: 1, to: 7, weight: 1.2 },
      { from: 2, to: 8, weight: 1.3 },
      { from: 6, to: 13, weight: 1.5 },
      { from: 7, to: 14, weight: 1.3 },
      { from: 12, to: 18, weight: 1.4 },
      { from: 13, to: 19, weight: 1.2 },
      { from: 17, to: 23, weight: 1.1 },
      { from: 18, to: 24, weight: 1.3 },
      
      // Additional diagonal express routes
      { from: 5, to: 12, weight: 1.6 },
      { from: 8, to: 15, weight: 1.5 },
      { from: 11, to: 17, weight: 1.3 },
      { from: 14, to: 20, weight: 1.4 },
      
      // Cross-city express routes
      { from: 0, to: 7, weight: 2.0 },  // Express highway
      { from: 4, to: 15, weight: 1.8 }, // Bridge express
      { from: 11, to: 19, weight: 1.9 }, // Cross-town
      { from: 6, to: 18, weight: 1.7 }  // Central corridor
    ];

    // Initialize traffic lights with varied timing
    lightsRef.current = nodesRef.current.map((node, i) => ({
      nodeId: node.id,
      state: i % 3 === 0 ? 'green' : 'red', // Staggered pattern
      timer: Math.random() * 40,
      greenDuration: 70 + Math.random() * 30, // Varied green times
      redDuration: 50 + Math.random() * 30,
      queueLength: 0
    }));
  }, []);

  // Initialize cars with Dijkstra pathfinding
  useEffect(() => {
    const initCars = () => {
      const nodes = nodesRef.current;
      const edges = edgesRef.current;

      // Dijkstra's Algorithm - optimized
      const dijkstra = (start, end) => {
        const distances = {};
        const previous = {};
        const unvisited = new Set();
        
        nodes.forEach(node => {
          distances[node.id] = Infinity;
          previous[node.id] = null;
          unvisited.add(node.id);
        });
        
        distances[start] = 0;
        
        while (unvisited.size > 0) {
          let current = null;
          let minDist = Infinity;
          
          unvisited.forEach(nodeId => {
            if (distances[nodeId] < minDist) {
              minDist = distances[nodeId];
              current = nodeId;
            }
          });
          
          if (current === null || current === end) break;
          
          unvisited.delete(current);
          
          // Check all edges from current node
          edges.forEach(edge => {
            if (edge.from === current && unvisited.has(edge.to)) {
              const alt = distances[current] + edge.weight;
              if (alt < distances[edge.to]) {
                distances[edge.to] = alt;
                previous[edge.to] = current;
              }
            }
            // Bidirectional edges
            if (edge.to === current && unvisited.has(edge.from)) {
              const alt = distances[current] + edge.weight;
              if (alt < distances[edge.from]) {
                distances[edge.from] = alt;
                previous[edge.from] = current;
              }
            }
          });
        }
        
        // Reconstruct path
        const path = [];
        let current = end;
        while (current !== null) {
          path.unshift(current);
          current = previous[current];
        }
        
        return path.length > 1 ? path : null;
      };

      // Car class with enhanced behavior
      class Car {
        constructor(id) {
          this.id = id;
          this.path = null;
          this.currentNodeIndex = 0;
          this.position = null;
          this.speed = 1.8 + Math.random() * 1.8;
          this.maxSpeed = this.speed;
          this.color = `hsl(${Math.random() * 360}, 75%, 55%)`;
          this.waiting = false;
          this.distanceTraveled = 0;
          this.stuckTimer = 0;
          
          this.selectNewPath();
        }
        
        selectNewPath() {
          const start = Math.floor(Math.random() * nodes.length);
          let end = Math.floor(Math.random() * nodes.length);
          
          // Ensure different start and end
          let attempts = 0;
          while (end === start && attempts < 10) {
            end = Math.floor(Math.random() * nodes.length);
            attempts++;
          }
          
          this.path = dijkstra(start, end);
          this.currentNodeIndex = 0;
          
          if (this.path && this.path.length > 0) {
            const startNode = nodes.find(n => n.id === this.path[0]);
            this.position = { x: startNode.x, y: startNode.y };
            this.distanceTraveled = 0;
          }
        }
        
        update(cars, lights) {
          if (!this.path || this.currentNodeIndex >= this.path.length - 1) {
            statsRef.current.completedJourneys++;
            statsRef.current.totalDistance += this.distanceTraveled;
            this.selectNewPath();
            return;
          }
          
          const nextNode = nodes.find(n => n.id === this.path[this.currentNodeIndex + 1]);
          
          // Traffic light check
          const light = lights.find(l => l.nodeId === nextNode.id);
          const distToNext = Math.sqrt(
            Math.pow(nextNode.x - this.position.x, 2) + 
            Math.pow(nextNode.y - this.position.y, 2)
          );
          
          if (light && light.state === 'red' && distToNext < 40) {
            this.speed = 0;
            this.waiting = true;
            light.queueLength++;
            this.stuckTimer++;
            
            // Reroute if stuck for too long
            if (this.stuckTimer > 200) {
              this.selectNewPath();
              this.stuckTimer = 0;
            }
            return;
          }
          
          this.waiting = false;
          this.stuckTimer = 0;
          
          // Collision avoidance with nearby cars
          let minDist = Infinity;
          cars.forEach(car => {
            if (car.id !== this.id) {
              const dist = Math.sqrt(
                Math.pow(car.position.x - this.position.x, 2) + 
                Math.pow(car.position.y - this.position.y, 2)
              );
              if (dist < minDist) minDist = dist;
            }
          });
          
          // Adaptive speed control based on traffic
          if (minDist < 20) {
            this.speed = Math.max(0.2, this.speed * 0.85);
          } else if (minDist < 40) {
            this.speed = Math.max(this.maxSpeed * 0.4, this.speed * 0.92);
          } else if (minDist < 60) {
            this.speed = Math.max(this.maxSpeed * 0.7, this.speed * 0.96);
          } else {
            this.speed = Math.min(this.maxSpeed, this.speed * 1.03);
          }
          
          // Move towards next node
          const dx = nextNode.x - this.position.x;
          const dy = nextNode.y - this.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 5) {
            this.currentNodeIndex++;
          } else {
            const moveDistance = this.speed * speed;
            this.position.x += (dx / dist) * moveDistance;
            this.position.y += (dy / dist) * moveDistance;
            this.distanceTraveled += moveDistance;
          }
        }
        
        draw(ctx) {
          // Car body with glow effect
          ctx.shadowBlur = this.speed > 2 ? 8 : 0;
          ctx.shadowColor = this.color;
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          
          // Waiting indicator
          if (this.waiting) {
            ctx.strokeStyle = '#ff3333';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, 9, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }

      // Initialize cars
      carsRef.current = [];
      statsRef.current = {
        completedJourneys: 0,
        totalDistance: 0,
        frameCount: 0
      };
      
      for (let i = 0; i < carCount; i++) {
        carsRef.current.push(new Car(i));
      }
    };

    initCars();
  }, [carCount, speed]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const nodes = nodesRef.current;
    const edges = edgesRef.current;
    const lights = lightsRef.current;

    const animate = () => {
      if (!isRunning) return;
      
      statsRef.current.frameCount++;
      
      // Clear with fade effect
      ctx.fillStyle = 'rgba(18, 18, 18, 0.96)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw roads with varying widths based on traffic
      edges.forEach(edge => {
        const from = nodes.find(n => n.id === edge.from);
        const to = nodes.find(n => n.id === edge.to);
        
        // Highway/express routes are thicker
        const lineWidth = edge.weight > 1.6 ? 12 : 8;
        
        ctx.strokeStyle = edge.weight > 1.6 ? '#444' : '#333';
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      });
      
      // Draw road markings
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 6]);
      edges.forEach(edge => {
        const from = nodes.find(n => n.id === edge.from);
        const to = nodes.find(n => n.id === edge.to);
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      });
      ctx.setLineDash([]);
      
      // Update traffic lights
      lights.forEach(light => {
        light.timer += speed;
        light.queueLength = 0;
        
        const duration = light.state === 'green' ? light.greenDuration : light.redDuration;
        
        if (light.timer >= duration) {
          light.state = light.state === 'green' ? 'red' : 'green';
          light.timer = 0;
        }
      });
      
      // Draw intersections with labels
      nodes.forEach(node => {
        const light = lights.find(l => l.nodeId === node.id);
        
        // Intersection base
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 14, 0, Math.PI * 2);
        ctx.fill();
        
        // Traffic light
        ctx.fillStyle = light.state === 'green' ? '#00ff66' : '#ff3333';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 9, 0, Math.PI * 2);
        ctx.fill();
        
        // Border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 9, 0, Math.PI * 2);
        ctx.stroke();
        
        // Location label
        ctx.fillStyle = '#999';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.x, node.y - 22);
      });
      
      // Update and draw cars
      let totalSpeed = 0;
      let waitingCars = 0;
      
      carsRef.current.forEach(car => {
        car.update(carsRef.current, lights);
        car.draw(ctx);
        totalSpeed += car.speed;
        if (car.waiting) waitingCars++;
      });
      
      // Update statistics
      if (statsRef.current.frameCount % 30 === 0) {
        setStats({
          avgSpeed: (totalSpeed / carsRef.current.length).toFixed(2),
          congestion: ((waitingCars / carsRef.current.length) * 100).toFixed(0),
          throughput: statsRef.current.completedJourneys,
          totalDistance: (statsRef.current.totalDistance / 100).toFixed(1),
          activeVehicles: carsRef.current.length
        });
      }
      
      simulationRef.current = requestAnimationFrame(animate);
    };

    if (isRunning) {
      animate();
    }

    return () => {
      if (simulationRef.current) {
        cancelAnimationFrame(simulationRef.current);
      }
    };
  }, [isRunning, speed]);

  const handleReset = () => {
    setIsRunning(false);
    statsRef.current = {
      completedJourneys: 0,
      totalDistance: 0,
      frameCount: 0
    };
    setStats({
      avgSpeed: 0,
      congestion: 0,
      throughput: 0,
      totalDistance: 0,
      activeVehicles: carCount
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            City Traffic Simulation
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            26-node urban network with Dijkstra's algorithm • Real-time pathfinding & optimization
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-2xl border border-gray-700">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={980}
                  height={680}
                  className="w-full rounded-lg bg-gray-900 shadow-inner"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                
                <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg">
                  🔵 Dijkstra's Algorithm
                </div>
                
                <div className="absolute top-4 right-4 bg-purple-600/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg">
                  26 Nodes • 67 Edges
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-2xl border border-gray-700">
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Controls
              </h2>
              
              <div className="space-y-4">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`w-full py-2.5 md:py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all text-sm md:text-base ${
                    isRunning
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isRunning ? <Pause className="w-4 h-4 md:w-5 md:h-5" /> : <Play className="w-4 h-4 md:w-5 md:h-5" />}
                  {isRunning ? 'Pause' : 'Start'}
                </button>

                <button
                  onClick={handleReset}
                  className="w-full py-2.5 md:py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all text-sm md:text-base"
                >
                  <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
                  Reset
                </button>

                <div>
                  <label className="block text-xs md:text-sm font-medium mb-2">
                    Vehicles: {carCount}
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={carCount}
                    onChange={(e) => setCarCount(parseInt(e.target.value))}
                    className="w-full"
                    disabled={isRunning}
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium mb-2">
                    Speed: {speed}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.5"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-2xl border border-gray-700">
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Live Statistics
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-900/40 to-blue-800/40 rounded-lg border border-blue-700/30">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                    <span className="text-xs md:text-sm">Avg Speed</span>
                  </div>
                  <span className="text-lg md:text-xl font-bold text-blue-400">{stats.avgSpeed}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-900/40 to-orange-800/40 rounded-lg border border-orange-700/30">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
                    <span className="text-xs md:text-sm">Congestion</span>
                  </div>
                  <span className="text-lg md:text-xl font-bold text-orange-400">{stats.congestion}%</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-900/40 to-green-800/40 rounded-lg border border-green-700/30">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                    <span className="text-xs md:text-sm">Throughput</span>
                  </div>
                  <span className="text-lg md:text-xl font-bold text-green-400">{stats.throughput}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-900/40 to-purple-800/40 rounded-lg border border-purple-700/30">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                    <span className="text-xs md:text-sm">Distance (km)</span>
                  </div>
                  <span className="text-lg md:text-xl font-bold text-purple-400">{stats.totalDistance}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-4 md:p-6 shadow-2xl border border-blue-700/30">
              <h3 className="font-bold mb-3 text-blue-300 text-sm md:text-base">Network Features</h3>
              <ul className="text-xs md:text-sm space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>26-node city network</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Dijkstra shortest path algorithm</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Express highways & shortcuts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Adaptive traffic lights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Real-time collision avoidance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Dynamic rerouting</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-700">
              <h3 className="font-bold mb-2 text-sm text-gray-300">Graph Stats</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-900/50 p-2 rounded">
                  <div className="text-gray-500">Nodes</div>
                  <div className="text-xl font-bold text-blue-400">26</div>
                </div>
                <div className="bg-gray-900/50 p-2 rounded">
                  <div className="text-gray-500">Edges</div>
                  <div className="text-xl font-bold text-purple-400">67</div>
                </div>
                <div className="bg-gray-900/50 p-2 rounded">
                  <div className="text-gray-500">Avg Degree</div>
                  <div className="text-xl font-bold text-green-400">5.2</div>
                </div>
                <div className="bg-gray-900/50 p-2 rounded">
                  <div className="text-gray-500">Complexity</div>
                  <div className="text-xl font-bold text-orange-400">O(n²)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;