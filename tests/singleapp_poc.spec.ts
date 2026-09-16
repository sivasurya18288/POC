import { test, expect } from "@playwright/test";
import { PADService } from "../Service/Pad.service";
import * as fs from "fs";
import path from "path";

const RESULT_FILE = path.resolve(
    process.cwd(),
    "reports",
    "result.json"
);

function updateStep(step: string) {

    let data: {
        status: string;
        steps: string[];
    } = {
        status: "RUNNING",
        steps: []
    };

    if (fs.existsSync(RESULT_FILE)) {

        const fileData = JSON.parse(
            fs.readFileSync(
                RESULT_FILE,
                "utf8"
            )
        );

        data = {
            status: fileData.status || "RUNNING",
            steps: Array.isArray(fileData.steps)
                ? fileData.steps
                : []
        };
    }

    data.steps.push(step);

    fs.writeFileSync(
        RESULT_FILE,
        JSON.stringify(
            data,
            null,
            2
        )
    );
}

test("SauceDemo + PAD POC", async ({ page }) => {

    const pad = new PADService();

    test.setTimeout(120000);

    try {

        updateStep("🚀 EXECUTION STARTED");

        // =====================================================
        // STEP 1 - SAUCE DEMO LOGIN
        // =====================================================

        await page.goto("https://www.saucedemo.com/");

        await page
            .getByPlaceholder("Username")
            .fill("standard_user");

        await page
            .getByPlaceholder("Password")
            .fill("secret_sauce");

        await page
            .getByRole("button", { name: "Login" })
            .click();

        await expect(
            page.getByText("Products")
        ).toBeVisible();

        updateStep(
            "✅ STEP 1 - SauceDemo Login - PASSED"
        );

        // =====================================================
        // STEP 2 - PAD FLOW 1
        // =====================================================

        const step1 = await pad.run("step1");

        expect(
            step1.success,
            `Notepad_Step_1 failed. Status: ${step1.status}`
        ).toBeTruthy();

        updateStep(
            "✅ STEP 2 - PAD Flow 1 - PASSED"
        );

        // =====================================================
        // STEP 3 - SAUCE DEMO ACTION
        // =====================================================

        await page
            .getByText("Sauce Labs Backpack")
            .click();

        await page
            .getByRole("button", {
                name: "Add to cart"
            })
            .click();

        updateStep(
            "✅ STEP 3 - Add Product To Cart - PASSED"
        );

        // =====================================================
        // STEP 4 - PAD FLOW 2
        // =====================================================

        const step2 = await pad.run("step2");

        expect(
            step2.success,
            `Notepad_Step_2 failed. Status: ${step2.status}`
        ).toBeTruthy();

        updateStep(
            "✅ STEP 4 - PAD Flow 2 - PASSED"
        );

        // =====================================================
        // STEP 5 - CART VALIDATION
        // =====================================================

        await page
            .locator('[data-test="shopping-cart-link"]')
            .click();

        await expect(
            page.getByText("Sauce Labs Backpack")
        ).toBeVisible();

        updateStep(
            "✅ STEP 5 - Cart Validation - PASSED"
        );

        // =====================================================
        // STEP 6 - PAD FLOW 3
        // =====================================================

        const step3 = await pad.run("step3");

        expect(
            step3.success,
            `Notepad_Step_3 failed. Status: ${step3.status}`
        ).toBeTruthy();

        updateStep(
            "✅ STEP 6 - PAD Flow 3 - PASSED"
        );

        // =====================================================
        // FINAL VALIDATION
        // =====================================================

        await expect(
            page.getByText("Sauce Labs Backpack")
        ).toBeVisible();

        updateStep(
            "✅ FINAL VALIDATION - PASSED"
        );

        updateStep(
            "✅ EXECUTION COMPLETED"
        );

        const finalData = JSON.parse(
            fs.readFileSync(
                RESULT_FILE,
                "utf8"
            )
        );

        finalData.status = "PASSED";

        fs.writeFileSync(
            RESULT_FILE,
            JSON.stringify(
                finalData,
                null,
                2
            )
        );

        console.log(
            "SAUCE DEMO + PAD POC PASSED"
        );

    } catch (error) {

        const finalData = JSON.parse(
            fs.readFileSync(
                RESULT_FILE,
                "utf8"
            )
        );

        finalData.status = "FAILED";

        finalData.steps.push(
            `❌ EXECUTION FAILED - ${String(error)}`
        );

        fs.writeFileSync(
            RESULT_FILE,
            JSON.stringify(
                finalData,
                null,
                2
            )
        );

        throw error;
    }

});