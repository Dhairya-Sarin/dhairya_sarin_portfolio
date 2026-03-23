"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { motion } from "framer-motion";
import { ArrowLeft, Github, ExternalLink, Package, Shield, CheckCircle2, Layers, Terminal, FileCode2, Cloud, Database, ShieldCheck, Table2, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Data Quality Gate",
    desc: "Catch bad data in a transient staging table before it ever touches production. Enforce a stage → validate → promote pattern.",
  },
  {
    icon: <Layers className="w-5 h-5" />,
    title: "Pluggable Validation Engine",
    desc: "Strategy pattern supporting 6+ configurable checks: RowCount, Null, Uniqueness, Freshness, AcceptedValues, and Custom SQL.",
  },
  {
    icon: <CheckCircle2 className="w-5 h-5" />,
    title: "Flexible Deployment",
    desc: "Supports append, replace, and merge strategies with dynamic partitioning for production-grade pipeline reliability.",
  },
  {
    icon: <Package className="w-5 h-5" />,
    title: "PyPI Package",
    desc: "Delivered as an open-source pip installable package with 97% test coverage, CI/CD automation, and comprehensive docs.",
  },
];

const checks = [
  { name: "RowCountCheck(min, max)", what: "Row count within bounds", example: "RowCountCheck(min=1000)" },
  { name: "NullCheck(column, max_fraction)", what: "Null rate below threshold", example: 'NullCheck(column="ID", max_fraction=0.0)' },
  { name: "UniquenessCheck(columns)", what: "Column(s) are unique", example: 'UniquenessCheck(columns=["ID"])' },
  { name: "FreshnessCheck(column, max_age_hours)", what: "Newest timestamp is recent enough", example: 'FreshnessCheck(column="TS", max_age_hours=24)' },
  { name: "AcceptedValuesCheck(column, values)", what: "All values in whitelist", example: 'AcceptedValuesCheck(column="STATUS", values=[...])' },
  { name: "CustomSQLCheck(sql, name)", what: "SQL returns 0 rows to pass", example: 'CustomSQLCheck(sql="SELECT * FROM {staging_table} WHERE ...")' },
];

const params = [
  { param: "source_path", type: "str", desc: "Cloud storage path (s3://, gcs://, azure://). Jinja-templatable" },
  { param: "file_format", type: "str", desc: "PARQUET, CSV, JSON, AVRO, ORC" },
  { param: "snowflake_conn_id", type: "str", desc: "Airflow connection ID for Snowflake" },
  { param: "target_database", type: "str", desc: "Snowflake database" },
  { param: "target_schema", type: "str", desc: "Snowflake schema" },
  { param: "target_table", type: "str", desc: "Snowflake table" },
  { param: "load_strategy", type: "str", desc: '"append" (default), "replace", or "merge"' },
  { param: "merge_keys", type: "list[str]", desc: "Required for merge strategy" },
  { param: "quality_checks", type: "list[BaseCheck]", desc: "Quality checks to run" },
  { param: "on_failure", type: "str", desc: '"fail" (default) or "warn"' },
  { param: "storage_integration", type: "str", desc: "Snowflake storage integration name" },
  { param: "copy_options", type: "str", desc: "Extra COPY INTO options" },
];

export default function SnowflakeQualityGatePage() {
  return (
    <main className="min-h-screen py-24 relative overflow-hidden flex flex-col">
      {/* Background */}
      <div className="absolute top-[-5%] right-[5%] w-[35%] h-[35%] bg-sky-500/15 blur-[130px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[5%] w-[30%] h-[30%] bg-blue-500/15 blur-[130px] rounded-full mix-blend-screen pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10 flex flex-col flex-grow">
        <FadeIn delay={0.1}>
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12 group w-max">
            <div className="p-2 rounded-full glass group-hover:bg-primary/10 transition-colors">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </div>
            <span className="font-medium">Back to Portfolio</span>
          </Link>
        </FadeIn>

        {/* Header */}
        <div className="flex flex-col gap-4 mb-12">
          <FadeIn delay={0.2}>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary">Snowflake Data Quality Gate Operator</h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-xl text-muted-foreground max-w-3xl">
              An open-source Apache Airflow provider that loads data from any cloud storage (S3, GCS, Azure) into Snowflake with a built-in data quality gate. Bad data is caught before it ever touches your production tables.
            </p>
          </FadeIn>
          <FadeIn delay={0.35}>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <a
                href="https://github.com/Dhairya-Sarin/snowflake-data-quality-gate-operator"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full glass hover:bg-foreground/10 border border-border/30 hover:border-border/50 transition-all font-medium text-sm"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
              <a
                href="https://pypi.org/project/snowflake-data-quality-gate-operator/0.1.1/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full glass hover:bg-foreground/10 border border-border/30 hover:border-border/50 transition-all font-medium text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                View on PyPI
              </a>
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">97% Test Coverage</span>
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">Apache 2.0</span>
            </div>
          </FadeIn>
        </div>

        {/* Key Features */}
        <FadeIn delay={0.4}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {features.map((f, i) => (
              <div key={i} className="glass p-5 rounded-2xl border border-border/30 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">{f.icon}</div>
                <div>
                  <h3 className="font-bold mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Animated Pipeline Flow */}
        <FadeIn delay={0.45}>
          <div className="glass p-6 md:p-8 rounded-3xl border border-border/30 mb-12 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
            <h2 className="font-bold text-xl mb-8 flex items-center gap-2 relative z-10">
              <Layers className="w-5 h-5 text-primary" />
              How It Works
            </h2>

            {/* Flow Steps */}
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-0 justify-between">
              {/* Step 1: Cloud Storage */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="flex flex-col items-center gap-3 flex-1"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                  <Cloud className="w-7 h-7 text-amber-400" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Cloud</span>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[120px]">COPY INTO from S3, GCS, or Azure</p>
                </div>
              </motion.div>

              {/* Connector 1 */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="hidden md:flex items-center flex-1 max-w-[80px]"
              >
                <div className="w-full h-[2px] bg-gradient-to-r from-amber-500/40 to-sky-500/40 relative">
                  <motion.div
                    className="absolute top-[-2px] w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                    animate={{ left: ["0%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                  />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
              </motion.div>

              {/* Step 2: Staging Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-col items-center gap-3 flex-1"
              >
                <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.15)]">
                  <Table2 className="w-7 h-7 text-sky-400" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Staging</span>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[120px]">Transient table for validation</p>
                </div>
              </motion.div>

              {/* Connector 2 */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="hidden md:flex items-center flex-1 max-w-[80px]"
              >
                <div className="w-full h-[2px] bg-gradient-to-r from-sky-500/40 to-violet-500/40 relative">
                  <motion.div
                    className="absolute top-[-2px] w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.6)]"
                    animate={{ left: ["0%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                  />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
              </motion.div>

              {/* Step 3: Quality Checks */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-col items-center gap-3 flex-1"
              >
                <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.15)]">
                  <ShieldCheck className="w-7 h-7 text-violet-400" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-violet-400">Validate</span>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[120px]">Run custom quality checks</p>
                </div>
              </motion.div>

              {/* Connector 3 */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="hidden md:flex items-center flex-1 max-w-[80px]"
              >
                <div className="w-full h-[2px] bg-gradient-to-r from-violet-500/40 to-emerald-500/40 relative">
                  <motion.div
                    className="absolute top-[-2px] w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.6)]"
                    animate={{ left: ["0%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                  />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
              </motion.div>

              {/* Step 4: Production */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="flex flex-col items-center gap-3 flex-1"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <Database className="w-7 h-7 text-emerald-400" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Promote</span>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[120px]">Append, replace, or merge</p>
                </div>
              </motion.div>
            </div>

            {/* Step descriptions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 relative z-10">
              {[
                { num: "1", label: "Stage", desc: "COPY INTO a transient Snowflake table from cloud storage", color: "text-amber-400" },
                { num: "2", label: "Validate", desc: "Run every configured quality check against the staged data", color: "text-sky-400" },
                { num: "3", label: "Promote", desc: "If all checks pass, move data to production tables", color: "text-violet-400" },
                { num: "4", label: "Cleanup", desc: "Staging table is always dropped, even on failure", color: "text-emerald-400" },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="p-3 rounded-xl bg-foreground/[0.03] border border-border/20"
                >
                  <span className={`text-xs font-bold ${step.color}`}>{step.num}. {step.label}</span>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Installation & Quick Start */}
        <FadeIn delay={0.5}>
          <div className="glass p-6 rounded-3xl border border-border/30 mb-12">
            <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-primary" />
              Installation & Quick Start
            </h2>
            <div className="mb-4">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Install</span>
              <pre className="mt-2 p-4 rounded-xl bg-foreground/5 border border-border/20 font-mono text-sm text-foreground overflow-x-auto">
                <code>pip install airflow-provider-s3-snowflake-quality</code>
              </pre>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Usage</span>
              <pre className="mt-2 p-4 rounded-xl bg-foreground/5 border border-border/20 font-mono text-xs text-foreground overflow-x-auto leading-relaxed">
                <code>{`from airflow_s3_snowflake_quality.operators import SnowflakeDataQualityGateOperator
from airflow_s3_snowflake_quality.checks import (
    RowCountCheck, NullCheck, UniquenessCheck,
    FreshnessCheck, AcceptedValuesCheck, CustomSQLCheck,
)

load_orders = SnowflakeDataQualityGateOperator(
    task_id="load_orders",
    source_path="s3://my-data-lake/orders/dt={{ ds }}/",
    file_format="PARQUET",
    snowflake_conn_id="snowflake_prod",
    target_database="ANALYTICS",
    target_schema="PUBLIC",
    target_table="ORDERS",
    load_strategy="merge",
    merge_keys=["ORDER_ID"],
    storage_integration="s3_integration",
    quality_checks=[
        RowCountCheck(min=1000),
        NullCheck(column="ORDER_ID", max_fraction=0.0),
        UniquenessCheck(columns=["ORDER_ID"]),
        FreshnessCheck(column="ORDER_TS", max_age_hours=24),
        AcceptedValuesCheck(column="STATUS",
            values=["pending", "shipped", "delivered", "cancelled"]),
        CustomSQLCheck(
            sql="SELECT * FROM {staging_table} WHERE TOTAL_AMOUNT < 0"),
    ],
)`}</code>
              </pre>
            </div>
          </div>
        </FadeIn>

        {/* Quality Checks Table */}
        <FadeIn delay={0.55}>
          <div className="glass p-6 rounded-3xl border border-border/30 mb-12">
            <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Quality Checks
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left py-3 px-3 text-muted-foreground font-semibold text-xs uppercase tracking-wider">Check</th>
                    <th className="text-left py-3 px-3 text-muted-foreground font-semibold text-xs uppercase tracking-wider">What it does</th>
                    <th className="text-left py-3 px-3 text-muted-foreground font-semibold text-xs uppercase tracking-wider">Example</th>
                  </tr>
                </thead>
                <tbody>
                  {checks.map((c, i) => (
                    <tr key={i} className="border-b border-border/10 hover:bg-foreground/[0.02] transition-colors">
                      <td className="py-3 px-3 font-mono text-xs text-primary">{c.name}</td>
                      <td className="py-3 px-3 text-muted-foreground">{c.what}</td>
                      <td className="py-3 px-3 font-mono text-xs text-foreground/70">{c.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Custom Checks */}
            <div className="mt-6">
              <h3 className="font-bold text-base mb-3">Writing Custom Checks</h3>
              <pre className="p-4 rounded-xl bg-foreground/5 border border-border/20 font-mono text-xs text-foreground overflow-x-auto leading-relaxed">
                <code>{`from airflow_s3_snowflake_quality.checks.base import (
    BaseCheck, CheckResult, CheckStatus
)

class MyCheck(BaseCheck):
    def validate(self, cursor, staging_table) -> CheckResult:
        count = self._execute_scalar(
            cursor,
            f"SELECT COUNT(*) FROM {staging_table} WHERE ..."
        )
        if count > 0:
            return CheckResult(
                check_name=self.name,
                status=CheckStatus.FAILED,
                message=f"Found {count} bad rows"
            )
        return CheckResult(
            check_name=self.name,
            status=CheckStatus.PASSED,
            message="All good"
        )`}</code>
              </pre>
            </div>
          </div>
        </FadeIn>

      </div>
    </main>
  );
}
