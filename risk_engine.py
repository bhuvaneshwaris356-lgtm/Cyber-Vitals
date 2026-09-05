def calculate_risk(asset):

    severity = asset["severity"] / 10
    criticality = asset["criticality_score"] / 4

    control_status = asset["control_status"]

    if control_status == "Active":
        control_gap = 0.2

    elif control_status == "Partial":
        control_gap = 0.6

    else:
        control_gap = 1.0

    probability = (
        severity *
        criticality *
        control_gap
    )

    probability = min(probability, 1)

    financial_impact = asset["financial_impact"]

    eal = probability * financial_impact

    return {
        "asset_id": asset["id"],
        "risk_probability": round(probability, 2),
        "financial_impact": financial_impact,
        "expected_annual_loss": round(eal, 2)
    }