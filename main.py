from optimizer import optimize_investment
from fastapi import FastAPI
from data_generator import generate_dataset
from risk_engine import calculate_risk
from nvd_data import get_cve_data

app = FastAPI(
    title="Cyber Risk Quantification API"
)


@app.get("/")
def home():

    return {
        "message": "Cyber Risk Platform API Running"
    }


@app.get("/generate-data")
def generate_data():

    assets = generate_dataset(20)

    return {
        "total_assets": len(assets),
        "assets": assets
    }


@app.get("/risk-analysis")
def risk_analysis():

    assets = generate_dataset(20)

    results = []

    total_eal = 0

    for asset in assets:

        risk = calculate_risk(asset)

        results.append(risk)

        total_eal += risk["expected_annual_loss"]

    return {
        "total_assets": len(assets),
        "total_expected_annual_loss": round(
            total_eal,
            2
        ),
        "risk_analysis": results
    }

@app.get("/dashboard")
def dashboard():

    assets = generate_dataset(20)

    risks = [calculate_risk(asset) for asset in assets]

    total_eal = sum(
        risk["expected_annual_loss"]
        for risk in risks
    )

    high_risk_assets = [
        risk for risk in risks
        if risk["risk_probability"] >= 0.7
    ]

    return {
        "total_assets": len(assets),
        "total_expected_annual_loss": round(total_eal, 2),
        "high_risk_assets": len(high_risk_assets),
        "average_risk_probability": round(
            sum(
                risk["risk_probability"]
                for risk in risks
            ) / len(risks),
            2
        )
    }

@app.get("/optimize")
def optimize(budget: float = 10000000):

    assets = generate_dataset(20)

    risks = [
        calculate_risk(asset)
        for asset in assets
    ]

    current_eal = sum(
        risk["expected_annual_loss"]
        for risk in risks
    )

    result = optimize_investment(
        budget,
        current_eal
    )

    return result

@app.get("/full-analysis")
def full_analysis(budget: float = 10000000):

    # Generate one common dataset
    assets = generate_dataset(20)

    # Calculate risk for all assets
    risks = [
        calculate_risk(asset)
        for asset in assets
    ]

    # Calculate total EAL
    current_eal = sum(
        risk["expected_annual_loss"]
        for risk in risks
    )

    # Find high-risk assets
    high_risk_assets = [
        risk for risk in risks
        if risk["risk_probability"] >= 0.7
    ]

    # Investment optimization
    optimization = optimize_investment(
        budget,
        current_eal
    )

    return {
        "dashboard": {
            "total_assets": len(assets),
            "current_total_eal": round(current_eal, 2),
            "high_risk_assets": len(high_risk_assets)
        },

        "risk_analysis": risks,

        "investment_optimization": optimization
    }


    
@app.get("/real-time-risk/{cve_id}")
def calculate_real_time_risk(cve_id: str):
    try:
        # Fetch real CVE data
        cve_data = get_cve_data(cve_id)

        # Create an asset using real CVSS data
        asset = {
            "id": cve_id,
            "severity": cve_data["cvss_score"],
            "criticality_score": 4,
            "control_status": "Active",
            "financial_impact": 500000
        }

        # Calculate risk
        risk = calculate_risk(asset)

        return {
            "source": "NVD - National Vulnerability Database",
            "cve_id": cve_id,
            "cvss_score": cve_data["cvss_score"],
            "calculated_risk": risk
        }

    except Exception as e:
        return {
            "error": str(e)
        }