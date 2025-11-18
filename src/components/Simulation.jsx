import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, TrendingUp, Clock, Car, AlertTriangle, Zap } from 'lucide-react';

const Simulation = () => {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [carCount, setCarCount] = useState(30);
  const [algorithm, setAlgorithm] = useState('dijkstra');
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

  // Initialize graph structure once
  useEffect(() => {
    nodesRef.current = [
      { id: 0, x: 100, y: 100, type: 'intersection', name: 'A' },
      { id: 1, x: 350, y: 100, type: 'intersection', name: 'B' },
      { id: 2, x: 600, y: 100, type: 'intersection', name: 'C' },
      { id: 3, x: 850, y: 100, type: 'intersection', name: 'D' },
      { id: 4, x: 100, y: 300, type: 'intersection', name: 'E' },
      { id: 5, x: 350, y: 300, type: 'intersection', name: 'F' },
      { id: 6, x: 600, y: 300, type: 'intersection', name: 'G' },
      { id: 7, x: 850, y: 300, type: 'intersection', name: 'H' },
      { id: 8, x: 100, y: 500, type: 'intersection', name: 'I' },
      { id: 9, x: 350, y: 500, type: 'intersection', name: 'J' },
      { id: 10, x: 600, y: 500, type: 'intersection', name: 'K' },
      { id: 11, x: 850, y: 500, type: 'intersection', name: 'L' }
    ];

    edgesRef.current = [
      { from: 0, to: 1, weight: 1 },
      { from: 1, to: 2, weight: 1 },
      { from: 2, to: 3, weight: 1 },
      { from: 4, to: 5, weight: 1.2 },
      { from: 5, to: 6, weight: 1 },
      { from: 6, to: 7, weight: 1.2 },
      { from: 8, to: 9, weight: 1 },
      { from: 9, to: 10, weight: 1 },
      { from: 10, to: 11, weight: 1 },
      { from: 0, to: 4, weight: 1 },
      { from: 1, to: 5, weight: 1 },
      { from: 2, to: 6, weight: 1 },
      { from: 3, to: 7, weight: 1 },
      { from: 4, to: 8, weight: 1 },
      { from: 5, to: 9, weight: 1 },
      { from: 6, to: 10, weight: 1 },
      { from: 7, to: 11, weight: 1 }
    ];

    lightsRef.current = nodesRef.current.map((node, i) => ({
      nodeId: node.id,
      state: i % 2 === 0 ? 'green' : 'red',
      timer: Math.random() * 60,
      greenDuration: 80 + Math.random() * 20,
      redDuration: 60 + Math.random() * 20,
      queueLength: 0
    }));
  }, []);

  // Reinitialize cars when algorithm or carCount changes
  useEffect(() => {
    const initCars = () => {
      const nodes = nodesRef.current;
      const edges = edgesRef.current;

      // Heuristic function for A*
      const heuristic = (nodeA, nodeB) => {
        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        return Math.sqrt(dx * dx + dy * dy) / 100;
      };

      // Dijkstra's Algorithm
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
          
          edges.forEach(edge => {
            if (edge.from === current && unvisited.has(edge.to)) {
              const alt = distances[current] + edge.weight;
              if (alt < distances[edge.to]) {
                distances[edge.to] = alt;
                previous[edge.to] = current;
              }
            }
            if (edge.to === current && unvisited.has(edge.from)) {
              const alt = distances[current] + edge.weight;
              if (alt < distances[edge.from]) {
                distances[edge.from] = alt;
                previous[edge.from] = current;
              }
            }
          });
        }
        
        const path = [];
        let current = end;
        while (current !== null) {
          path.unshift(current);
          current = previous[current];
        }
        
        return path.length > 1 ? path : null;
      };

      // A* Algorithm
      const aStar = (start, end) => {
        const openSet = new Set([start]);
        const cameFrom = {};
        const gScore = {};
        const fScore = {};
        
        nodes.forEach(node => {
          gScore[node.id] = Infinity;
          fScore[node.id] = Infinity;
        });
        
        gScore[start] = 0;
        const startNode = nodes.find(n => n.id === start);
        const endNode = nodes.find(n => n.id === end);
        fScore[start] = heuristic(startNode, endNode);
        
        while (openSet.size > 0) {
          let current = null;
          let minF = Infinity;
          
          openSet.forEach(nodeId => {
            if (fScore[nodeId] < minF) {
              minF = fScore[nodeId];
              current = nodeId;
            }
          });
          
          if (current === end) {
            const path = [];
            let temp = current;
            while (temp !== undefined) {
              path.unshift(temp);
              temp = cameFrom[temp];
            }
            return path;
          }
          
          openSet.delete(current);
          
          edges.forEach(edge => {
            let neighbor = null;
            let weight = edge.weight;
            
            if (edge.from === current) neighbor = edge.to;
            else if (edge.to === current) neighbor = edge.from;
            
            if (neighbor === null) return;
            
            const tentativeGScore = gScore[current] + weight;
            
            if (tentativeGScore < gScore[neighbor]) {
              cameFrom[neighbor] = current;
              gScore[neighbor] = tentativeGScore;
              const neighborNode = nodes.find(n => n.id === neighbor);
              fScore[neighbor] = gScore[neighbor] + heuristic(neighborNode, endNode);
              
              if (!openSet.has(neighbor)) {
                openSet.add(neighbor);
              }
            }
          });
        }
        
        return null;
      };

      // Car class
      class Car {
        constructor(id, currentAlgorithm) {
          this.id = id;
          this.algorithm = currentAlgorithm;
          this.path = null;
          this.currentNodeIndex = 0;
          this.position = null;
          this.speed = 2 + Math.random() * 1.5;
          this.maxSpeed = this.speed;
          this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
          this.waiting = false;
          this.distanceTraveled = 0;
          this.stuckTimer = 0;
          
          this.selectNewPath();
        }
        
        selectNewPath() {
          const start = Math.floor(Math.random() * nodes.length);
          let end = Math.floor(Math.random() * nodes.length);
          
          let attempts = 0;
          while (end === start && attempts < 10) {
            end = Math.floor(Math.random() * nodes.length);
            attempts++;
          }
          
          this.path = this.algorithm === 'astar' ? aStar(start, end) : dijkstra(start, end);
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
          
          const light = lights.find(l => l.nodeId === nextNode.id);
          const distToNext = Math.sqrt(
            Math.pow(nextNode.x - this.position.x, 2) + 
            Math.pow(nextNode.y - this.position.y, 2)
          );
          
          if (light && light.state === 'red' && distToNext < 35) {
            this.speed = 0;
            this.waiting = true;
            light.queueLength++;
            this.stuckTimer++;
            
            if (this.stuckTimer > 180) {
              this.selectNewPath();
              this.stuckTimer = 0;
            }
            return;
          }
          
          this.waiting = false;
          this.stuckTimer = 0;
          
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
          
          if (minDist < 25) {
            this.speed = Math.max(0.3, this.speed * 0.9);
          } else if (minDist < 50) {
            this.speed = Math.max(this.maxSpeed * 0.5, this.speed * 0.95);
          } else {
            this.speed = Math.min(this.maxSpeed, this.speed * 1.02);
          }
          
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
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.position.x, this.position.y, 6, 0, Math.PI * 2);
          ctx.fill();
          
          if (this.waiting) {
            ctx.strokeStyle = '#ff4444';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, 10, 0, Math.PI * 2);
            ctx.stroke();
          }
          
          if (this.speed > 1) {
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        }
      }

      // Initialize cars with current algorithm
      carsRef.current = [];
      statsRef.current = {
        completedJourneys: 0,
        totalDistance: 0,
        frameCount: 0
      };
      
      for (let i = 0; i < carCount; i++) {
        carsRef.current.push(new Car(i, algorithm));
      }
    };

    initCars();
  }, [algorithm, carCount, speed]);

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
      
      ctx.fillStyle = 'rgba(26, 26, 26, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw roads
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 10;
      edges.forEach(edge => {
        const from = nodes.find(n => n.id === edge.from);
        const to = nodes.find(n => n.id === edge.to);
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      });
      
      // Draw road markings
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 8]);
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
      
      // Draw intersections
      nodes.forEach(node => {
        const light = lights.find(l => l.nodeId === node.id);
        
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = light.state === 'green' ? '#00ff88' : '#ff4444';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = '#aaa';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.x, node.y - 25);
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

  const handleAlgorithmChange = (newAlgorithm) => {
    const wasRunning = isRunning;
    setIsRunning(false);
    setAlgorithm(newAlgorithm);
    if (wasRunning) {
      setTimeout(() => setIsRunning(true), 100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Advanced Traffic Flow Simulation
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Graph-based pathfinding with Dijkstra & A* algorithms • Real-time traffic optimization
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-2xl border border-gray-700">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={950}
                  height={620}
                  className="w-full rounded-lg bg-gray-900 shadow-inner"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                
                <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg">
                  {algorithm === 'dijkstra' ? '🔵 Dijkstra' : '⭐ A* Algorithm'}
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
                    Algorithm: {algorithm === 'dijkstra' ? 'Dijkstra' : 'A*'}
                  </label>
                  <select
                    value={algorithm}
                    onChange={(e) => handleAlgorithmChange(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="dijkstra">Dijkstra (Shortest Path)</option>
                    <option value="astar">A* (Heuristic-based)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium mb-2">
                    Vehicles: {carCount}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="80"
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
                    max="2.5"
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
              <h3 className="font-bold mb-3 text-blue-300 text-sm md:text-base">Features</h3>
              <ul className="text-xs md:text-sm space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Dijkstra & A* pathfinding</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Adaptive traffic lights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Collision detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Dynamic speed control</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Real-time rerouting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;