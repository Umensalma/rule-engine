// src/App.jsx
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Container, Typography } from '@mui/material';
import CreateRule from './components/CreateRule';
import CombineRules from './components/CombineRules';
import EvaluateRule from './components/EvaluateRule';

function App() {
    return (
        <Container maxWidth="md">
            <Typography variant="h3" align="center" gutterBottom>
                Rule Engine
            </Typography>
            <CreateRule />
            <CombineRules />
            <EvaluateRule />
        </Container>
    );
}

export default App;
