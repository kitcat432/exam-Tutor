import {
  loadModel,
  completion,
  unloadModel,
  LLAMA_3_2_1B_INST_Q4_0
} from "@qvac/sdk";

console.log("Starting QVAC Offline Exam Coach...");
console.log("Loading local QVAC model...");

try {
  const modelId = await loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0,
    modelConfig: {
      device: "cpu",
      gpu_layers: 0,
      ctx_size: 2048
    },
    onProgress: (progress) => {
      process.stdout.write(
        `\rLoading model: ${progress.percentage.toFixed(0)}%`
      );
    }
  });

  console.log("\n\nModel loaded successfully!");
  console.log("Running local AI inference...\n");

  const run = completion({
    modelId,
    history: [
      {
        role: "user",
        content:
          "Explain in one short sentence why practice tests help students learn."
      }
    ],
    stream: true
  });

  for await (const token of run.tokenStream) {
    process.stdout.write(token);
  }

  console.log("\n\nLocal QVAC inference completed!");

  await unloadModel({ modelId });

  console.log("Model unloaded.");
} catch (error) {
  console.error("\nQVAC error:");
  console.error(error);
  process.exit(1);
}