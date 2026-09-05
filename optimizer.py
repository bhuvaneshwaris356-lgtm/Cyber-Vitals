SECURITY_CONTROLS = [
    {
        "name": "Multi-Factor Authentication",
        "cost": 1000000,
        "risk_reduction": 0.25
    },
    {
        "name": "Endpoint Detection and Response",
        "cost": 2500000,
        "risk_reduction": 0.40
    },
    {
        "name": "Firewall Upgrade",
        "cost": 1500000,
        "risk_reduction": 0.30
    },
    {
        "name": "Employee Security Training",
        "cost": 500000,
        "risk_reduction": 0.15
    },
    {
        "name": "Data Encryption",
        "cost": 2000000,
        "risk_reduction": 0.35
    }
]


def optimize_investment(budget, current_eal):

    controls = sorted(
        SECURITY_CONTROLS,
        key=lambda x: x["risk_reduction"] / x["cost"],
        reverse=True
    )

    selected_controls = []
    remaining_budget = budget
    total_reduction = 0

    for control in controls:

        if control["cost"] <= remaining_budget:

            selected_controls.append(control)

            remaining_budget -= control["cost"]

            total_reduction += control["risk_reduction"]

    # Maximum reduction limited to 90%
    total_reduction = min(total_reduction, 0.90)

    risk_reduction_amount = current_eal * total_reduction

    optimized_eal = current_eal - risk_reduction_amount

    return {
        "budget": budget,
        "selected_controls": selected_controls,
        "total_investment": budget - remaining_budget,
        "remaining_budget": remaining_budget,
        "risk_reduction_percentage": round(
            total_reduction * 100,
            2
        ),
        "current_eal": round(current_eal, 2),
        "risk_reduction_amount": round(
            risk_reduction_amount,
            2
        ),
        "optimized_eal": round(optimized_eal, 2)
    }