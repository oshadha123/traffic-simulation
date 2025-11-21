# 🚦 Advanced Traffic Flow Simulation

A sophisticated traffic simulation system implementing graph algorithms (Dijkstra) with real-time visualization, traffic light optimization, and comprehensive statistics.

## 🎯 Features

### Core Algorithms
- **Dijkstra's Algorithm**: Shortest path calculation for optimal routing
- **Traffic Flow Optimization**: Dynamic speed adjustment based on congestion
- **Collision Avoidance**: Real-time proximity detection and speed modulation
- **Traffic Light Synchronization**: Smart traffic signal timing

### Visualization
- Real-time graph-based road network
- Dynamic vehicle movement with collision detection
- Traffic light states (red/green) with timing
- Performance statistics dashboard
- Interactive controls

### Statistics & Metrics
- Average vehicle speed
- Congestion percentage
- Throughput measurement
- Real-time performance monitoring

## 🐳 Docker Deployment

### Quick Start

1. **Build and run with Docker Compose**
```bash
docker-compose up -d
```

2. **Access the application**
```
http://localhost:3000
```

### Development Mode

Run with hot-reload for development:
```bash
docker-compose --profile development up
```
Access at: `http://localhost:5173`

### Docker Commands

```bash
# Build the image
docker-compose build

# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose up -d --build
```

## 🛠️ Local Development (Without Docker)

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

```

## 📊 Algorithm Implementation Details

### 1. Dijkstra's Algorithm
```
Time Complexity: O((V + E) log V)
Space Complexity: O(V)
```
Used for calculating shortest paths between intersection nodes in the road network.

### 2. Graph Structure
- **Nodes**: Intersection points with traffic lights
- **Edges**: Road segments with weight/distance
- **Dynamic weights**: Adjusted based on real-time traffic conditions

### 3. Traffic Light Optimization
- Green/Red cycle timing
- Vehicle detection at intersections
- Queue management
- Throughput maximization

### 4. Collision Avoidance
- Proximity-based speed reduction
- Minimum safe distance enforcement
- Dynamic acceleration/deceleration

## 🎓 Educational Value

This project demonstrates:
- Graph data structures and algorithms
- Real-time simulation techniques
- Object-oriented programming
- Docker containerization
- Modern React development
- Canvas-based visualization
- Performance optimization

## 📈 Performance Metrics

The simulation tracks:
- **Average Speed**: Mean velocity across all vehicles
- **Congestion Level**: Percentage of waiting vehicles
- **Throughput**: Number of completed journeys
- **Total Distance**: Cumulative distance traveled

## 🔧 Configuration

Modify these parameters in the code:
- `carCount`: Number of vehicles (10-80)
- `speed`: Simulation speed multiplier (0.5-2.5x)
- Traffic light timing (green/red duration)
- Road network topology (nodes and edges)

## 📦 Project Structure

```
traffic-simulation/
├── src/
│   ├── components/
│   │   └── Simulation.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
│   └── vite.svg
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## 🎓 Course Work Submission

This project fulfills the requirements for:
- **Course**: Fundamental Algorithms
- **Topic**: Graphs (Traffic Simulation)
- **Features**: 
  - ✅ Graph-based road network
  - ✅ Dijkstra's algorithm implementation
  - ✅ Real-time visualization
  - ✅ Docker containerization
  - ✅ Comprehensive documentation

---
