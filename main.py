from pulp import LpMaximize, LpProblem, LpVariable, lpSum, LpBinary


# -----------------------------
# 1. OUR BUDGET
# -----------------------------

budget = 10000000   # ₹1 Crore


# -----------------------------
# 2. CYBERSECURITY FIXES
# -----------------------------

controls = [
    {
        "id": "C1",
        "name": "MFA",
        "cost": 1000000,
        "risk_reduction": 25
    },
    {
        "id": "C2",
        "name": "EDR",
        "cost": 1500000,
        "risk_reduction": 20
    },
    {
        "id": "C3",
        "name": "SIEM",
        "cost": 3000000,
        "risk_reduction": 30
    },
    {
        "id": "C4",
        "name": "Security Training",
        "cost": 500000,
        "risk_reduction": 10
    },
    {
        "id": "C5",
        "name": "Vulnerability Management",
        "cost": 1000000,
        "risk_reduction": 18
    }
]


# -----------------------------
# 3. CREATE OPTIMIZATION MODEL
# -----------------------------

model = LpProblem(
    "Cybersecurity_Investment",
    LpMaximize
)


# -----------------------------
# 4. CREATE YES/NO DECISIONS
# -----------------------------

decision = {}

for control in controls:

    decision[control["id"]] = LpVariable(
        control["id"],
        cat=LpBinary
    )


# -----------------------------
# 5. MAXIMIZE RISK REDUCTION
# -----------------------------

model += lpSum(
    control["risk_reduction"] * decision[control["id"]]
    for control in controls
)


# -----------------------------
# 6. BUDGET LIMIT
# -----------------------------

model += lpSum(
    control["cost"] * decision[control["id"]]
    for control in controls
) <= budget


# -----------------------------
# 7. SOLVE
# -----------------------------

model.solve()


# -----------------------------
# 8. SHOW THE ANSWER
# -----------------------------

print("\nRecommended Security Investments:")
print("----------------------------------")

total_cost = 0
total_risk_reduction = 0

for control in controls:

    if decision[control["id"]].value() == 1:

        print(
            control["name"],
            "| Cost: ₹", control["cost"],
            "| Risk Reduction:", control["risk_reduction"]
        )

        total_cost += control["cost"]
        total_risk_reduction += control["risk_reduction"]


print("----------------------------------")
print("Total Investment: ₹", total_cost)
print("Remaining Budget: ₹", budget - total_cost)



current_risk = 85

current_risk = 85

risk_after = current_risk

for control in controls:

    if decision[control["id"]].value() == 1:

        reduction = control["risk_reduction"] / 100

        risk_after = risk_after * (1 - reduction)

actual_risk_reduction = current_risk - risk_after

print("Risk Before:", current_risk)
print("Risk After:", round(risk_after, 2))
print("Actual Risk Reduction:",round(actual_risk_reduction,2))