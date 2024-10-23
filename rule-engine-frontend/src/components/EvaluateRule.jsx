// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';

const EvaluateRule = () => {
    const [ruleString, setRuleString] = useState('');
    const [attributes, setAttributes] = useState({});  // key-value pairs of attributes
    const [attributeKey, setAttributeKey] = useState('');
    const [attributeValue, setAttributeValue] = useState('');
    const [evaluationResult, setEvaluationResult] = useState(null);

    const handleAddAttribute = () => {
        setAttributes({
            ...attributes,
            [attributeKey]: attributeValue
        });
        setAttributeKey('');
        setAttributeValue('');
    };

    const handleEvaluateRule = async () => {
        try {
            const response = await axios.post('http://localhost:8000/evaluate_rule', {
                rule_string: ruleString,
                attributes: attributes
            });
            setEvaluationResult(response.data.result);
        } catch (error) {
            console.error('Error evaluating rule:', error);
        }
    };

    return (
        <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
            <Typography variant="h5" gutterBottom>Evaluate Rule</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Rule String"
                    variant="outlined"
                    placeholder="e.g., age > 30 and department == 'Engineering'"
                    value={ruleString}
                    onChange={(e) => setRuleString(e.target.value)}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        label="Attribute Key"
                        variant="outlined"
                        value={attributeKey}
                        onChange={(e) => setAttributeKey(e.target.value)}
                    />
                    <TextField
                        label="Attribute Value"
                        variant="outlined"
                        value={attributeValue}
                        onChange={(e) => setAttributeValue(e.target.value)}
                    />
                    <Button variant="contained" color="secondary" onClick={handleAddAttribute}>
                        Add Attribute
                    </Button>
                </Box>
                <Box>
                    <Typography variant="body1">Attributes:</Typography>
                    <pre>{JSON.stringify(attributes, null, 2)}</pre>
                </Box>
                <Button variant="contained" color="primary" onClick={handleEvaluateRule}>
                    Evaluate Rule
                </Button>
            </Box>

            {evaluationResult !== null && (
                <Box mt={4}>
                    <Typography variant="h6">Evaluation Result:</Typography>
                    <Typography variant="body1">{evaluationResult ? "True" : "False"}</Typography>
                </Box>
            )}
        </Paper>
    );
};

export default EvaluateRule;
