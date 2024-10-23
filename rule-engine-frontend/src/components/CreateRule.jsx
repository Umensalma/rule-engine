// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import axios from 'axios';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';

const CreateRule = () => {
    const [ruleString, setRuleString] = useState('');
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [error, setError] = useState(null);

    const handleCreateRule = async () => {
        try {
            setError(null); // Reset error state before making a request
            const response = await axios.post('http://localhost:8000/create_rule', { rule_string: ruleString });
            const astData = response.data.AST;

            // Convert AST data to nodes and edges dynamically
            const { generatedNodes, generatedEdges } = astToGraph(astData);
            setNodes(generatedNodes);
            setEdges(generatedEdges);

        } catch (error) {
            console.error('Error creating rule:', error.response ? error.response.data : error.message);
            setError('Error creating rule: ' + (error.response ? error.response.data.error : error.message));
        }
    };

    // Recursive function to convert AST to graph nodes and edges
    const astToGraph = (ast, parentId = null, currentId = 1, posX = 0, posY = 0) => {
        let nodes = [];
        let edges = [];
        let nodeId = `node-${currentId}`;
        
        // Create the node for the current AST element
        if (ast.op) {
            nodes.push({
                id: nodeId,
                data: { label: ast.op },
                position: { x: posX, y: posY },
            });
        } else if (ast.condition) {
            nodes.push({
                id: nodeId,
                data: { label: ast.condition },
                position: { x: posX, y: posY },
            });
        }

        // Create an edge from the parent node to the current node, if a parent exists
        if (parentId) {
            edges.push({
                id: `e-${parentId}-${nodeId}`,
                source: parentId,
                target: nodeId,
                type: 'smoothstep',
            });
        }

        // Recursively add child nodes and edges
        if (ast.children && ast.children.length > 0) {
            ast.children.forEach((child, index) => {
                const newId = currentId + index + 1;
                const newPosX = posX + (index % 2 === 0 ? -150 : 150);
                const newPosY = posY + 100;
                const { generatedNodes, generatedEdges } = astToGraph(child, nodeId, newId, newPosX, newPosY);
                nodes = nodes.concat(generatedNodes);
                edges = edges.concat(generatedEdges);
            });
        }

        return { generatedNodes: nodes, generatedEdges: edges };
    };

    return (
        <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
            <Typography variant="h5" gutterBottom>Create Rule</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Enter rule"
                    variant="outlined"
                    placeholder="e.g., age > 30 AND salary > 50000"
                    value={ruleString}
                    onChange={(e) => setRuleString(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleCreateRule}>
                    Create Rule
                </Button>
            </Box>

            {error && (
                <Typography color="error" mt={2}>{error}</Typography>
            )}

            {/* Render the AST visualization */}
            <div style={{ height: 400, marginTop: '20px' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    fitView
                >
                    <MiniMap />
                    <Controls />
                    <Background />
                </ReactFlow>
            </div>
        </Paper>
    );
};

export default CreateRule;
