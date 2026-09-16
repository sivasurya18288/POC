import { exec } from "child_process";
import fs from "fs";
import { PAD_FLOWS, PADFlowName } from "../PAD config/PAD.config";
export interface PADResult {
    flow: PADFlowName;
    flowName: string;
    success: boolean;
    status: string;
    resultFile: string;
}

export class PADService {
    /**
     * Launch PAD flow and wait for its result file.
     */
    async run(
        flowName: PADFlowName,
        timeoutMs: number = 15 * 60 * 1000
    ): Promise<PADResult> {
        const flow = PAD_FLOWS[flowName];
        console.log(`Starting PAD Flow : ${flow.name}`);
        console.log(`Result File      : ${flow.resultFile}`);

        // ------------------------------------------------
        // 1. Delete result from previous execution
        this.deleteOldResult(flow.resultFile);

        // 2. Launch PAD
        // ------------------------------------------------
        await this.launchFlow(flow.url);
        console.log(`PAD flow launched: ${flow.name}`);
        console.log("Waiting for PAD result...");

        // 3. Wait for NEW result
        // ------------------------------------------------
        const result = await this.waitForResult(flowName,flow.name,flow.resultFile,timeoutMs);

        // 4. Display result
        // ------------------------------------------------
        console.log(`PAD Flow : ${result.flowName}`);
        console.log(`Status   : ${result.status}`);
        console.log(`Success  : ${result.success}`);
        return result;
    }

    // Launch PAD
    // ====================================================
    private async launchFlow(flowUrl: string): Promise<void> {
        return new Promise((resolve, reject) => {
            exec(`start "" "${flowUrl}"`,(error) => {
                    if (error) {
                        reject(
                            new Error(
                                `Failed to launch PAD flow.\n${error.message}`
                            )
                        );
                        return;
                    }
                    resolve();
                }
            );
        });
    }

    // Delete old result
    // ====================================================
    private deleteOldResult(filePath: string): void {
        if (!fs.existsSync(filePath)) {
            console.log("No previous result file found.");
            return;
        }
        console.log(`Deleting previous result: ${filePath}`);
        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            throw new Error(`Unable to delete previous PAD result file:\n` +`${filePath}\n\n${error}`);
        }
    }

    // Wait for result
    // ====================================================
    private async waitForResult(flowName: PADFlowName,flowDisplayName: string,resultFile: string,timeoutMs: number): Promise<PADResult> {
        const startTime = Date.now();
        while (Date.now() - startTime < timeoutMs) {

    // Check whether PAD created the result

    if (fs.existsSync(resultFile)) {
    console.log(`Result file found: ${resultFile}`);
    
    // IMPORTANT:
    // PAD creates UTF-16 LE files
    const rawResult = fs.readFileSync(resultFile,"utf16le");
    console.log(`Raw PAD result: ${JSON.stringify(rawResult)}`);

    // Normalize result
    // ----------------------------------------
    const status = this.normalizeResult(rawResult);
    console.log(`Normalized PAD result: ${status}`);

    // Determine PASS / FAIL
    // ----------------------------------------
    const success = this.isSuccessful(status);
    return {
    flow: flowName,
    flowName: flowDisplayName,success,status,resultFile};
            }

    // --------------------------------------------
    // Check again after 2 seconds
    await this.sleep(2000);
        }

    // Timeout
    // ------------------------------------------------
    throw new Error(`PAD Flow timed out.\n\n` +`Flow : ${flowDisplayName}\n` +`Result File: ${resultFile}\n` +`Timeout    : ${timeoutMs / 1000} seconds`);
    }

    // Normalize PAD result
    // ====================================================
    private normalizeResult(value: string): string {
        return value
            // Remove UTF-16 BOM if present
            .replace(/^\uFEFF/, "")
            // Remove replacement character
            .replace(/\uFFFD/g, "")
            // Remove null characters if present
            .replace(/\0/g, "")
            // Convert line breaks to spaces
            .replace(/\r?\n/g, " ")
            // Normalize multiple spaces
            .replace(/\s+/g, " ")
            // Remove leading/trailing spaces
            .trim()
            // Case insensitive comparison
            .toUpperCase();
    }

    // Determine whether PAD execution succeeded
    // ====================================================
    private isSuccessful(status: string): boolean {
    return status.includes("COMPLETED");
    }

    // Sleep
    // ====================================================

    private async sleep(ms: number): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}
 