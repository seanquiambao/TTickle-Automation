import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";

/**
 * This file sets up OpenTelemetry in your Next.js app.
 * It sends traces and metrics to an OpenTelemetry Collector
 * over OTLP/HTTP (default Collector endpoint: :4318).
 *
 * Required env var in your Vercel project settings:
 * OTEL_EXPORTER_OTLP_ENDPOINT=https://collector.yourdomain.com:4318
 */

export const register = async () => {
  const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  if (!otlpEndpoint) {
    console.warn("⚠️ OTEL_EXPORTER_OTLP_ENDPOINT not set; OTel will not start");
    return;
  }

  const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({
      url: `${otlpEndpoint}/v1/traces`,
    }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: `${otlpEndpoint}/v1/metrics`,
      }),
      exportIntervalMillis: 15000,
    }),
    instrumentations: [getNodeAutoInstrumentations({})],
  });

  await sdk.start();
  console.log(`✅ OpenTelemetry started; exporting to ${otlpEndpoint}`);

  const shutdown = async (signal: string) => {
    try {
      await sdk?.shutdown();
      console.log(`🛑 OpenTelemetry shut down on ${signal}`);
    } catch (err) {
      console.error("Error during OTel shutdown", err);
    } finally {
      process.exit(0);
    }
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};
