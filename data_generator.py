import random

ASSET_TYPES = [
    "Web Server",
    "Database Server",
    "Employee Laptop",
    "Cloud Server",
    "Network Router"
]

VULNERABILITIES = [
    {"name": "SQL Injection", "severity": 9},
    {"name": "Outdated Software", "severity": 7},
    {"name": "Open Port", "severity": 6},
    {"name": "Weak Password", "severity": 8},
    {"name": "Misconfigured Cloud Storage", "severity": 9}
]

CRITICALITY = {
    "Low": 1,
    "Medium": 2,
    "High": 3,
    "Critical": 4
}

CONTROL_STATUS = [
    "Active",
    "Partial",
    "Missing"
]


def generate_asset(asset_id):

    vulnerability = random.choice(VULNERABILITIES)

    criticality_name = random.choice(
        list(CRITICALITY.keys())
    )

    control = random.choice(CONTROL_STATUS)

    return {
        "id": asset_id,
        "asset_type": random.choice(ASSET_TYPES),
        "vulnerability": vulnerability["name"],
        "severity": vulnerability["severity"],
        "criticality": criticality_name,
        "criticality_score": CRITICALITY[criticality_name],
        "control_status": control,
        "financial_impact": random.randint(
            500000,
            5000000
        )
    }


def generate_dataset(count=20):

    return [
        generate_asset(i + 1)
        for i in range(count)
    ]