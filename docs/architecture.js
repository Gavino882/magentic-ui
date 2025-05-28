document.addEventListener('DOMContentLoaded', function() {
    fetch('architecture-data.json')
        .then(response => response.json())
        .then(architectureData => {
            // Cytoscape.js initialization code using architectureData
            // The rest of the Cytoscape initialization code (cy, style, layout)
            // from the previous version of this file should go here.

            const cy = cytoscape({
                container: document.getElementById('cy'), // container to render in

                elements: [ // list of graph elements to start with
                    ...architectureData.nodes,
                    ...architectureData.edges
                ],

                style: [ // an array of style declarations to control presentation
                    // Main node style
                    {
                        selector: 'node',
                        style: {
                            'background-color': '#888', // Default color
                            'label': 'data(name)',
                            'width': '120px',       // Increased width
                            'height': '70px',       // Adjusted height for rectangle
                            'shape': 'rectangle',   // Changed to rectangle
                            'text-valign': 'center',
                            'text-halign': 'center',
                            'font-size': '10px',
                            'color': 'white',
                            'text-wrap': 'wrap',
                            'text-max-width': '110px', // Adjusted max width
                            'border-width': 1,
                            'border-color': '#555'
                        }
                    },
                    // Edge style
                    {
                        selector: 'edge',
                        style: {
                            'width': 2,
                            'line-color': '#aaa',
                            'target-arrow-color': '#aaa',
                            'target-arrow-shape': 'triangle',
                            'curve-style': 'bezier', // Or 'taxi', 'unbundled-bezier'
                            'label': 'data(label)',
                            'font-size': '8px',
                            'color': '#444',
                            'text-rotation': 'autorotate',
                            'text-margin-y': -10,
                            'edge-text-rotation': 'autorotate'
                        }
                    },
                    // Node type specific styles
                    {
                        selector: 'node[type="Frontend"]',
                        style: { 'background-color': '#3498db' } // Blue
                    },
                    {
                        selector: 'node[type="Backend"]',
                        style: { 'background-color': '#27ae60' } // Darker Green
                    },
                    {
                        selector: 'node[type="BackendComponent"]',
                        style: { 'background-color': '#2ecc71' } // Lighter Green
                    },
                    {
                        selector: 'node[type="Core"]',
                        style: { 'background-color': '#f1c40f' } // Yellow
                    },
                    {
                        selector: 'node[type="Agent"]',
                        style: { 'background-color': '#e67e22' } // Orange
                    },
                    {
                        selector: 'node[type="Tool"]',
                        style: { 'background-color': '#9b59b6' } // Purple
                    },
                    {
                        selector: 'node[type="Interface"]',
                        style: { 'background-color': '#34495e' } // Dark Blue/Grey
                    },
                    {
                        selector: 'node[type="CoreFeature"]',
                        style: { 'background-color': '#e74c3c' } // Red
                    },
                    // Style for parent nodes (if you use them for grouping)
                    {
                        selector: ':parent',
                        style: {
                            'text-valign': 'top',
                            'text-halign': 'center',
                            'background-opacity': 0.333,
                            'background-color': '#ccc',
                            'border-width': 2,
                            'border-color': '#aaa',
                            'font-size': '14px',
                            'label': 'data(name)'
                        }
                    }
                ],

                layout: {
                    name: 'cose', // cose, circle, concentric, dagre
                    idealEdgeLength: 150,
                    nodeOverlap: 40,
                    refresh: 20,
                    fit: true,
                    padding: 50,
                    randomize: false,
                    componentSpacing: 120,
                    nodeRepulsion: 450000,
                    edgeElasticity: 120,
                    nestingFactor: 5,
                    gravity: 80,
                    numIter: 1500,
                    initialTemp: 200,
                    coolingFactor: 0.95,
                    minTemp: 1.0,
                    animate: 'end',
                    animationDuration: 500
                }
            });

            // Make nodes draggable
            cy.nodes().filter(ele => !ele.isParent()).forEach(node => {
                node.grabify();
            });

            // Log node details on click
            cy.on('tap', 'node', function(evt){
                var node = evt.target;
                if (!node.isParent()) { // Don't log for parent compound nodes
                    console.log('Tapped ' + node.id() + ': ' + node.data('description'));
                    // Future enhancement: show description in a dedicated panel
                }
            });

            // Optional: Add a loading indicator or error handling for fetch
        })
        .catch(error => console.error('Error loading architecture data:', error));
});
