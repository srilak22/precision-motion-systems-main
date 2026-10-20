import React from "react";
import { getFamilyPrinciple } from "@/data/knowledgeGraph/familyPrinciples";
import { ArrowRight, Cpu, CheckCircle2, AlertTriangle, Layers, Activity } from "lucide-react";

interface Props {
  categorySlug: string;
  productName: string;
}

export const ProductFamilyOperatingPrinciple: React.FC<Props> = ({
  categorySlug,
  productName,
}) => {
  const principle = getFamilyPrinciple(categorySlug);

  if (!principle) {
    return null;
  }

  return (
    <section className="border-b border-border/40 bg-card px-5 py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.24em] text-signal">
          <Activity size={14} />
          <span>Physics &amp; Mechatronic Operating Principle</span>
        </div>
        <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
          Kinematic Transformation Sequence for {productName}
        </h2>
        <p className="mt-3 max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {principle.physicsPrinciple} Assigned to{" "}
          <strong className="text-foreground">{principle.primarySubsystem}</strong>.
        </p>

        {/* 3-Step Sequence Flow */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {principle.sequenceSteps.map((step) => (
            <div
              key={step.stepNumber}
              className="relative flex flex-col justify-between rounded-lg border border-border bg-background p-6 transition-all hover:border-signal/60 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <span className="font-mono text-xs font-bold text-signal">
                    STEP 0{step.stepNumber}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-muted-foreground">
                    Kinematic Phase
                  </span>
                </div>

                <h3 className="mt-4 font-display text-xl font-bold uppercase tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>

                <div className="mt-6 space-y-2 border-t border-border/40 pt-4 text-[11px] font-mono">
                  <div>
                    <span className="block text-[9px] uppercase font-sans text-muted-foreground">
                      Input State:
                    </span>
                    <span className="text-foreground font-semibold">
                      {step.inputSignalOrState}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-sans text-muted-foreground">
                      Physical Transformation:
                    </span>
                    <span className="text-signal">
                      {step.transformation}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-sans text-muted-foreground">
                      Output State:
                    </span>
                    <span className="text-foreground font-semibold">
                      {step.outputSignalOrState}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Diagnostics & Alternative Technologies */}
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Diagnostic Checkpoints */}
          <div className="rounded-lg border border-border bg-background/60 p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-signal mb-3">
              <CheckCircle2 size={15} />
              <span>Diagnostic Quality Checkpoints</span>
            </div>
            <ul className="space-y-2.5 text-xs">
              {principle.diagnosticCheckpoints.map((chk, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-foreground/90">
                  <span className="font-mono text-signal text-[11px] font-bold">[{idx + 1}]</span>
                  <span>{chk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Alternative Technologies */}
          <div className="rounded-lg border border-border bg-background/60 p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              <Layers size={15} />
              <span>Alternative Technologies &amp; Engineering Trade-Offs</span>
            </div>
            <div className="space-y-3">
              {principle.alternativeTechnologies.map((alt, idx) => (
                <div key={idx} className="border-l-2 border-signal/40 pl-3">
                  <h4 className="text-xs font-bold uppercase text-foreground">
                    {alt.technologyName}
                  </h4>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    {alt.engineeringTradeOff}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
