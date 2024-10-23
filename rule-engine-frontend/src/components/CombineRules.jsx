// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Paper, Select, MenuItem } from '@mui/material';

const CombineRules = () => {
    const [rules, setRules] = useState([{ rule_string: '' }]);
    const [operator, setOperator] = useState('AND');
    const [combinedAST, setCombinedAST] = useState(null);

    const handleRuleChange = (index, value) => {
        const newRules = [...rules];
        newRules[index].rule_string = value;
        setRules(newRules);
    };

    const handleAddRule = () => {
        setRules([...rules, { rule_string: '' }]);
    };

    const handleCombineRules = async () => {
        try {
            const response = await axios.post('http://localhost:8000/combine_rules', {
                rules: rules,
                operator: operator
            });
            setCombinedAST(response.data.Combined_AST);
        } catch (error) {
            console.error('Error combining rules:', error);
        }
    };

    return (
        <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
            <Typography variant="h5" gutterBottom>Combine Rules</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {rules.map((rule, index) => (
                    <TextField
                        key={index}
                        label={`Rule ${index + 1}`}
                        variant="outlined"
                        placeholder="e.g., age > 30"
                        value={rule.rule_string}
                        onChange={(e) => handleRuleChange(index, e.target.value)}
                    />
                ))}
                <Button variant="contained" color="secondary" onClick={handleAddRule}>
                    Add Rule
                </Button>

                <Select
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    style={{ marginTop: '20px' }}
                >
                    <MenuItem value="AND">AND</MenuItem>
                    <MenuItem value="OR">OR</MenuItem>
                </Select>

                <Button variant="contained" color="primary" onClick={handleCombineRules}>
                    Combine Rules
                </Button>
            </Box>

            {combinedAST && (
                <Box mt={4}>
                    <Typography variant="h6">Combined AST:</Typography>
                    <pre>{JSON.stringify(combinedAST, null, 2)}</pre>
                </Box>
            )}
        </Paper>
    );
};

export default CombineRules;
