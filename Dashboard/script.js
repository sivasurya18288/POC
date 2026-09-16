document.getElementById("runBtn").addEventListener("click", async () => {

    document.getElementById("executionStatus").innerText = "RUNNING";

    document.getElementById("result").innerHTML = "";

    try {

        await fetch(
            "http://localhost:3000/run",
            {
                method: "POST"
            }
        );

        startPolling();

    } catch (error) {

        console.error(error);

        document.getElementById("executionStatus").innerText =
            "FAILED";
    }

});

function startPolling() {

    const timer = setInterval(async () => {

        try {

            const response = await fetch(
                "http://localhost:3000/result"
            );

            const data = await response.json();

            document.getElementById("executionStatus").innerText =
                data.status;

            if (Array.isArray(data.steps)) {

document.getElementById("result").innerHTML =
    data.steps
        .map(step => {

            const color = step.includes("❌")
                ? "red"
                : "green";

            return `<div style="margin:4px 0;font-weight:bold;color:${color};">${step}</div>`;

        })
        .join("");            }

            if (
                data.status === "PASSED" ||
                data.status === "FAILED"
            ) {
                clearInterval(timer);
            }

        } catch (error) {

            console.error(error);

        }

    }, 1000);

}