import ast
import operator

# Parse AST node into custom JSON-like structure
def parse_ast(node):
    if isinstance(node, ast.BoolOp):  # Handle AND / OR operators
        return {
            'op': type(node.op).__name__,
            'children': [parse_ast(value) for value in node.values]
        }
    elif isinstance(node, ast.Compare):  # Handle comparison operations
        left = parse_ast(node.left)
        comparators = [parse_ast(comp) for comp in node.comparators]
        ops = [type(op).__name__ for op in node.ops]
        return {
            'condition': f"{left} {' '.join(ops)} {' '.join(comparators)}"
        }
    elif isinstance(node, ast.Name):  # Handle variable names
        return node.id
    elif isinstance(node, ast.Constant):  # Handle constant values
        return str(node.value)
    else:
        raise TypeError(f"Unhandled AST node type: {type(node).__name__}")

# Safe operators for rule evaluation
safe_operators = {
    ast.Eq: operator.eq,
    ast.NotEq: operator.ne,
    ast.Lt: operator.lt,
    ast.LtE: operator.le,
    ast.Gt: operator.gt,
    ast.GtE: operator.ge,
    ast.And: operator.and_,
    ast.Or: operator.or_
}

# Function to evaluate an AST expression
def eval_expr(expr, attributes):
    if isinstance(expr, ast.BoolOp):
        values = [eval_expr(v, attributes) for v in expr.values]
        if isinstance(expr.op, ast.And):
            return all(values)
        elif isinstance(expr.op, ast.Or):
            return any(values)
    elif isinstance(expr, ast.Compare):
        left = eval_expr(expr.left, attributes)
        right = eval_expr(expr.comparators[0], attributes)
        op = safe_operators[type(expr.ops[0])]
        return op(left, right)
    elif isinstance(expr, ast.Name):
        return attributes.get(expr.id)
    elif isinstance(expr, ast.Constant):
        return expr.value
    else:
        raise ValueError(f"Unsupported expression type: {type(expr)}")
