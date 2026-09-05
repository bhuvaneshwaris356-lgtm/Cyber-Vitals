from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

from pulp import LpMaximize, LpProblem, LpVariable, lpSum, LpBinary


app = FastAPI()


class SecurityControl(BaseModel):
    id: str
    name: str
    cost: float
    risk_reduction: float


class OptimizationRequest(BaseModel):
    budget: float
    current_risk: float
    controls: List[SecurityControl]


@app.get("/")
def home():
    return {
        "message": "Cyber Risk Optimizer is running!"
    }


@app.post("/api/optimize")
def optimize(request: OptimizationRequest):

    model = LpProblem(
        "Cybersecurity_Investment",
        LpMaximize
    )

    decision = {}

    for control in request.controls:

        decision[control.id] = LpVariable(
            control.id,
            cat=LpBinary
        )

    model += lpSum(
        control.risk_reduction * decision[control.id]
        for control in request.controls
    )

    model += lpSum(
        control.cost * decision[control.id]
        for control in request.controls
    ) <= request.budget

    model.solve()

    selected_controls = []
    total_cost = 0

    for control in request.controls:

        if decision[control.id].value() == 1:

            selected_controls.append({
                "id": control.id,
                "name": control.name,
                "cost": control.cost,
                "risk_reduction": control.risk_reduction
            })

            total_cost += control.cost

    risk_after = request.current_risk

    for control in request.controls:

        if decision[control.id].value() == 1:

            reduction = control.risk_reduction / 100

            risk_after = risk_after * (1 - reduction)

    actual_risk_reduction = (
        request.current_risk - risk_after
    )

    return {
        "budget": request.budget,
        "total_investment": total_cost,
        "remaining_budget":
            request.budget - total_cost,
        "risk_before":
            request.current_risk,
        "risk_after":
            round(risk_after, 2),
        "actual_risk_reduction":
            round(actual_risk_reduction, 2),
        "selected_controls":
            selected_controls
    }