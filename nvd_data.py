import requests


def get_cve_data(cve_id):

    url = "https://services.nvd.nist.gov/rest/json/cves/2.0"

    params = {
        "cveId": cve_id
    }

    try:

        response = requests.get(
            url,
            params=params,
            timeout=20
        )

        response.raise_for_status()

        data = response.json()

        vulnerabilities = data.get(
            "vulnerabilities",
            []
        )

        if not vulnerabilities:
            return None

        cve = vulnerabilities[0]["cve"]

        # Get description
        descriptions = cve.get(
            "descriptions",
            []
        )

        description = "No description available"

        for item in descriptions:

            if item.get("lang") == "en":

                description = item.get(
                    "value"
                )

                break

        # Get CVSS score
        metrics = cve.get(
            "metrics",
            {}
        )

        cvss_score = 0.0
        severity = "UNKNOWN"

        if "cvssMetricV31" in metrics:

            cvss_data = metrics[
                "cvssMetricV31"
            ][0]["cvssData"]

            cvss_score = cvss_data.get(
                "baseScore",
                0.0
            )

            severity = cvss_data.get(
                "baseSeverity",
                "UNKNOWN"
            )

        elif "cvssMetricV30" in metrics:

            cvss_data = metrics[
                "cvssMetricV30"
            ][0]["cvssData"]

            cvss_score = cvss_data.get(
                "baseScore",
                0.0
            )

            severity = cvss_data.get(
                "baseSeverity",
                "UNKNOWN"
            )

        elif "cvssMetricV2" in metrics:

            cvss_data = metrics[
                "cvssMetricV2"
            ][0]["cvssData"]

            cvss_score = cvss_data.get(
                "baseScore",
                0.0
            )

            severity = (
                "HIGH"
                if cvss_score >= 7
                else "MEDIUM"
            )

        return {
            "cve_id": cve.get("id"),
            "description": description,
            "cvss_score": cvss_score,
            "severity": severity,
            "published": cve.get("published")
        }

    except requests.RequestException as error:

        print(
            f"Error retrieving {cve_id}: {error}"
        )

        return None

if __name__ == "__main__":
    cve = get_cve_data("CVE-2021-44228")
    print(cve)