export const PAD_FLOWS = {
   step1: {
       name: "Notepad_Step_1",
       url: "ms-powerautomate:/console/flow/run?workflowName=Notepad_Step_1",
       resultFile: "C:\\Users\\sssurya\\OneDrive - Capgemini\\CASY\\POC\\Step1.txt",
       expectedResult: "STEP1 COMPLETED"
   },
   step2: {
       name: "Notepad_Step_2",
       url: "ms-powerautomate:/console/flow/run?workflowName=Notepad_Step_2",
       resultFile: "C:\\Users\\sssurya\\OneDrive - Capgemini\\CASY\\POC\\Step2.txt",
       expectedResult: "STEP2 COMPLETED"

   },
   step3: {
       name: "Notepad_Step_3",
       url: "ms-powerautomate:/console/flow/run?workflowName=Notepad_Step_3",
       resultFile: "C:\\Users\\sssurya\\OneDrive - Capgemini\\CASY\\POC\\Step3.txt",
       expectedResult: "STATUS = COMPLETED"

   },
} as const;
export type PADFlowName = keyof typeof PAD_FLOWS;