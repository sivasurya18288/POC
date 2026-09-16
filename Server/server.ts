import express from "express";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";

const app = express();

const RESULT_FILE = "./reports/result.json";

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
    res.send("Playwright Dashboard Server Running");
});

app.post("/run", (_req, res) => {

    // Reset result file for new execution
    fs.writeFileSync(
        RESULT_FILE,
        JSON.stringify(
            {
                status: "RUNNING",
                steps: []
            },
            null,
            2
        )
    );

    exec(
        "npx playwright test tests/singleapp_poc.spec.ts",
        (error, stdout, stderr) => {

            console.log(stdout);

            if (stderr) {
                console.log(stderr);
            }

            const current = JSON.parse(
                fs.readFileSync(
                    RESULT_FILE,
                    "utf8"
                )
            );

            if (error) {

                current.status = "FAILED";

                if (Array.isArray(current.steps)) {
                    current.steps.push(
                        `❌ EXECUTION FAILED - ${error.message}`
                    );
                }

                fs.writeFileSync(
                    RESULT_FILE,
                    JSON.stringify(
                        current,
                        null,
                        2
                    )
                );

                console.error(error);
                return;
            }

            // Keep all steps and only update status
            current.status = "PASSED";

            fs.writeFileSync(
                RESULT_FILE,
                JSON.stringify(
                    current,
                    null,
                    2
                )
            );

            console.log("Execution Completed Successfully");
        }
    );

    res.json({
        status: "STARTED",
        message: "Execution Started"
    });
});

app.get("/result", (_req, res) => {

    try {

        const result = fs.readFileSync(
            RESULT_FILE,
            "utf8"
        );

        res.send(JSON.parse(result));

    } catch {

        res.send({
            status: "IDLE",
            steps: []
        });

    }

});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});