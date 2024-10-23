from pydantic import BaseModel
from typing import List, Dict

# Model for creating a rule
class RuleRequest(BaseModel):
    rule_string: str

# Model for combining multiple rules
class CombineRulesRequest(BaseModel):
    rules: List[RuleRequest]
    operator: str  # Either 'AND' or 'OR'

# Model for evaluating a rule with attributes
class EvaluateRuleRequest(BaseModel):
    rule_string: str
    attributes: Dict[str, any]

    class Config:
        arbitrary_types_allowed = True
