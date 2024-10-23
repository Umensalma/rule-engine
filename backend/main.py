from fastapi import FastAPI
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from models import RuleRequest, CombineRulesRequest, EvaluateRuleRequest
from ast_helpers import parse_ast, eval_expr
import ast
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify the allowed origins here
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


# Create Rule API
@app.post("/create_rule")
async def create_rule(request: RuleRequest):
    try:
        # Parse the rule string into an AST
        tree = ast.parse(request.rule_string, mode='eval')
        ast_json = parse_ast(tree.body)
        return {"AST": ast_json}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing rule: {str(e)}")

# Combine Rules API
@app.post("/combine_rules")
async def combine_rules(request: CombineRulesRequest):
    try:
        combined_ast = {
            'op': request.operator,
            'children': [parse_ast(ast.parse(rule.rule_string, mode='eval').body) for rule in request.rules]
        }
        return {"combined_AST": combined_ast}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error combining rules: {str(e)}")

# Evaluate Rule API
@app.post("/evaluate_rule")
async def evaluate_rule(request: EvaluateRuleRequest):
    try:
        # Parse the rule into an AST
        tree = ast.parse(request.rule_string, mode='eval')
        result = eval_expr(tree.body, request.attributes)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error evaluating rule: {str(e)}")

# Health check route
@app.get("/")
async def root():
    return {"message": "Rule Engine API is up and running"}
