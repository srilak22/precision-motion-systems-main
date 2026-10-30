import fs from 'node:fs';
import path from 'node:path';

// --- ENHANCE APPLICATIONS PAGE ---
const appPagePath = path.resolve('src/routes/applications/$applicationId.tsx');
if (fs.existsSync(appPagePath)) {
  let content = fs.readFileSync(appPagePath, 'utf8');

  // Fix dead solution links
  content = content.replace('/solutions/factory-automation', '/solutions/robotic-automation');
  content = content.replace('/solutions/mobile-robotics', '/solutions/material-handling');
  content = content.replace('/solutions/smart-manufacturing', '/solutions/machine-integration');

  // Add CtaBanner import if missing
  if (!content.includes('CtaBanner')) {
    content = content.replace(
      'import { RelatedContent } from "@/components/common/RelatedContent";',
      'import { RelatedContent } from "@/components/common/RelatedContent";\nimport { CtaBanner } from "@/components/common/CtaBanner";'
    );
  }

  // Insert CtaBanner right before RelatedContent
  if (!content.includes('CONNECTED JOURNEY CTA BANNER')) {
    const target = '{/* 6. CONTEXTUAL RELATED CONTENT */}';
    const bannerBlock = `{/* CONNECTED JOURNEY CTA BANNER */}
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10 my-8">
        <CtaBanner
          variant="precision"
          badge="APPLICATION SIZING &amp; FEASIBILITY"
          headline={\`Accelerate \${application.title} Automation\`}
          description="Access our specialized kinematics sizing tools, discuss payload vs cycle takt trade-offs, and receive 3D CAD space-claim models verified for this manufacturing discipline."
          ctaPrimary={{
            label: "Schedule Application Review",
            href: "/book-consultation",
          }}
          ctaSecondary={{
            label: "Open Sizing Calculator",
            href: "/application-finder",
          }}
        />
      </div>

      {/* 6. CONTEXTUAL RELATED CONTENT */}`;
    content = content.replace(target, bannerBlock);
  }

  fs.writeFileSync(appPagePath, content, 'utf8');
  console.log('Successfully enhanced src/routes/applications/$applicationId.tsx');
}

// --- ENHANCE RESOURCES INDEX PAGE ---
const resourcesPagePath = path.resolve('src/routes/resources/index.tsx');
if (fs.existsSync(resourcesPagePath)) {
  let content = fs.readFileSync(resourcesPagePath, 'utf8');

  // Add CtaBanner import if missing
  if (!content.includes('CtaBanner')) {
    content = content.replace(
      'import { RelatedContent } from "@/components/common/RelatedContent";',
      'import { RelatedContent } from "@/components/common/RelatedContent";\nimport { CtaBanner } from "@/components/common/CtaBanner";'
    );
  }

  // Insert CtaBanner right before RelatedContent
  if (!content.includes('CONNECTED JOURNEY CTA BANNER')) {
    const target = '{/* 4. CONTEXTUAL RELATED CONTENT */}';
    const bannerBlock = `{/* CONNECTED JOURNEY CTA BANNER */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 my-8">
        <CtaBanner
          variant="dark"
          badge="TECHNICAL SUPPORT &amp; CAD ASSETS"
          headline="Cannot find the specific CAD model or test certificate?"
          description="Our engineering team maintains 3D STEP files, thermal dissipation curves, and ISO 9283 repeatability dossiers for every catalog actuator and reducer."
          ctaPrimary={{
            label: "Request Custom Engineering Files",
            href: "/contact/engineering-enquiry",
          }}
          ctaSecondary={{
            label: "Consult Application Engineer",
            href: "/book-consultation",
          }}
        />
      </div>

      {/* 4. CONTEXTUAL RELATED CONTENT */}`;
    content = content.replace(target, bannerBlock);
  }

  fs.writeFileSync(resourcesPagePath, content, 'utf8');
  console.log('Successfully enhanced src/routes/resources/index.tsx');
}
