import { config } from "dotenv"
import path from "path"
config({ path: path.join(process.cwd(), ".env") })
config({ path: path.join(process.cwd(), ".env.local"), override: true })

import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

const frqs2023 = [
  // ── Q1: PHO Signaling Pathway (Long, 9 pts) ─────────────────────────────────
  {
    topicSlug: "gene-expression",
    year: 2023,
    questionNum: 1,
    type: "LONG" as const,
    difficulty: "HARD" as const,
    totalPoints: 9,
    summary: "PHO signaling pathway regulation of gene expression in yeast; phosphorylation, signal amplification, and mutant analysis.",
    imageUrls: ["/frq-images/2023/q1_fig1_cropped.png"],
    prompt: `In eukaryotic microorganisms, the PHO signaling pathway regulates the expression of certain genes. These genes, Pho target genes, encode proteins involved in regulating phosphate homeostasis. When the level of extracellular inorganic phosphate (Pi) is high, a transcriptional activator Pho4 is phosphorylated by a complex of two proteins, Pho80–Pho85. As a result, the Pho target genes are not expressed. When the level of extracellular Pi is low, the activity of the Pho80–Pho85 complex is inhibited by another protein, Pho81, enabling Pho4 to induce the expression of these target genes. A simplified model of this pathway is shown in Figure 1.

Figure 1. A simplified model of the regulation of expression of Pho target genes in (A) a high-phosphate (high-Pi) environment and (B) a low-phosphate (low-Pi) environment.

To study the role of the different proteins in the PHO pathway, researchers used a wild-type strain of yeast to create a strain with a mutant form of Pho81 (pho81mt) and a strain with a mutant form of Pho4 (pho4mt). In each of these mutant strains, researchers measured the activity of a particular enzyme, APase, which removes phosphates from its substrates and is encoded by PHO1, a Pho target gene. They then determined the level of PHO1 mRNA relative to that of the wild-type yeast strain, which was set to 10.

TABLE 1. APase ACTIVITY AND RELATIVE AMOUNTS OF PHO1 mRNA

| Yeast Strain | Mutation | APase Activity High-Pi (μU/mL/OD, avg ±2SE) | APase Activity Low-Pi (μU/mL/OD, avg ±2SE) | PHO1 mRNA High-Pi (avg ±2SE) | PHO1 mRNA Low-Pi (avg ±2SE) |
|---|---|---|---|---|---|
| Wild-type | None | 0.5 ± 0.1 | 17.3 ± 0.9 | 0.1 ± 0.0 | 10 ± 2.0 |
| pho81mt | Nonfunctional Pho81 | 0.4 ± 0.1 | 0.6 ± 0.1 | 0.7 ± 0.2 | 0.9 ± 0.8 |
| pho4mt | Nonfunctional Pho4 | 0.5 ± 0.0 | 0.8 ± 0.2 | 0.6 ± 0.4 | 0.3 ± 0.1 |

(a) Describe the effect that the addition of a charged phosphate group can have on a protein that would cause the protein to become inactive. Explain how a signal can be amplified during signal transduction in a pathway such as the PHO signaling pathway.

(b) Based on Table 1, identify a dependent variable in the researchers' experiment. Justify the researchers' using the wild-type strain for the creation of the mutant strains. Justify the researchers' using mutant strains in which only a single component of the pathway was mutated in each strain.

(c) Based on the data in Table 1, identify the yeast strain and growth conditions that lead to the highest relative amount of PHO1 mRNA. Calculate the percent change in APase activity in wild-type yeast cells in a high-Pi environment compared with that of wild-type cells in a low-Pi environment.

(d) In a follow-up experiment, researchers created a strain of yeast with a mutation that resulted in a nonfunctional Pho85 protein. Based on Figure 1, predict the effects of this mutation on PHO1 expression in the mutant strain in a high-Pi environment. Provide reasoning to justify your prediction.`,
    rubric: [
      {
        id: "r1",
        name: "Part (a) – Phosphorylation inactivates protein",
        points: 1,
        description: "Addition of a charged phosphate group changes the structure/shape of the protein, causing it to become inactive.",
        keywords: ["phosphorylation", "shape", "structure", "conformation", "inactive", "charged"],
      },
      {
        id: "r2",
        name: "Part (a) – Signal amplification",
        points: 1,
        description: "Each enzyme (or activated protein) in a signal transduction pathway can act on many copies of a downstream protein, amplifying the signal.",
        keywords: ["amplification", "enzyme", "many copies", "cascade", "signal transduction", "amplify"],
      },
      {
        id: "r3",
        name: "Part (b) – Dependent variable",
        points: 1,
        description: "APase activity OR the relative amount of PHO1 mRNA is a dependent variable.",
        keywords: ["APase activity", "PHO1 mRNA", "dependent variable", "amount of mRNA", "enzyme activity"],
      },
      {
        id: "r4",
        name: "Part (b) – Wild-type justification",
        points: 1,
        description: "Using wild-type ensures any observed differences between strains are due to the introduced mutations, not other genetic differences between strains.",
        keywords: ["wild-type", "genetic background", "only mutation differs", "identical", "differences due to mutation"],
      },
      {
        id: "r5",
        name: "Part (b) – Single mutation justification",
        points: 1,
        description: "Mutating only a single component in each strain allows researchers to test the effect of each mutation separately and determine which component is responsible for any observed differences.",
        keywords: ["single mutation", "test separately", "isolate effect", "determine which component", "one variable"],
      },
      {
        id: "r6",
        name: "Part (c) – Highest PHO1 mRNA",
        points: 1,
        description: "Wild-type yeast in a low-Pi environment has the highest relative amount of PHO1 mRNA (10 ± 2.0).",
        keywords: ["wild-type", "low-Pi", "low phosphate", "highest mRNA", "10"],
      },
      {
        id: "r7",
        name: "Part (c) – Percent change calculation",
        points: 1,
        description: "Percent change = 3,360% [(17.3 − 0.5)/0.5 × 100%] OR −97% [(0.5 − 17.3)/17.3 × 100%].",
        keywords: ["3360%", "3,360", "97%", "percent change", "17.3", "0.5"],
      },
      {
        id: "r8",
        name: "Part (d) – Predict PHO1 expression with nonfunctional Pho85",
        points: 1,
        description: "PHO1/target genes will be expressed (constitutively) in the high-Pi environment.",
        keywords: ["expressed", "PHO1 expressed", "target genes expressed", "constitutive", "high-Pi"],
      },
      {
        id: "r9",
        name: "Part (d) – Justification for prediction",
        points: 1,
        description: "In a high-Pi environment, nonfunctional Pho85 means the Pho80–Pho85 complex cannot phosphorylate/inhibit Pho4, so Pho4 remains active and induces target gene expression.",
        keywords: ["Pho85 nonfunctional", "cannot phosphorylate Pho4", "Pho4 active", "not phosphorylated", "Pho80-Pho85 complex"],
      },
    ],
  },

  // ── Q2: Mitochondria & CO2 Levels (Long, 9 pts) ─────────────────────────────
  {
    topicSlug: "cellular-energetics",
    year: 2023,
    questionNum: 2,
    type: "LONG" as const,
    difficulty: "MEDIUM" as const,
    totalPoints: 9,
    summary: "Effect of elevated CO2 on mitochondria count, graphing, and maternal inheritance of organelle mutations.",
    imageUrls: [],
    prompt: `Elevated levels of CO2 increase the rate of photosynthesis and growth in plants. Scientists studying the mechanisms involved in these increases examined a variety of species and found that when plants are exposed to elevated levels of CO2, there is an increase in the number of chloroplasts per cell. To investigate whether the elevated levels of CO2 have a similar effect on the number of mitochondria in plant cells, the scientists then selected six of these species to quantify the number of mitochondria per cell when the plants were exposed to both normal and elevated levels of CO2 (Table 1).

TABLE 1. AVERAGE NUMBER OF MITOCHONDRIA IN PLANTS EXPOSED TO NORMAL AND ELEVATED LEVELS OF CO2

| Species | Mitochondria at Normal CO2 (per 100 μm² of cell area, avg ±2SE) | Mitochondria at Elevated CO2 (per 100 μm² of cell area, avg ±2SE) |
|---|---|---|
| 1 | 1.0 ± 0.10 | 1.6 ± 0.10 |
| 2 | 0.4 ± 0.05 | 0.9 ± 0.08 |
| 3 | 0.5 ± 0.07 | 0.9 ± 0.10 |
| 4 | 0.3 ± 0.03 | 0.6 ± 0.06 |
| 5 | 0.7 ± 0.06 | 1.5 ± 0.22 |
| 6 | 1.3 ± 0.15 | 2.4 ± 0.22 |

(a) Describe the role of the inner mitochondrial membrane in cellular respiration.

(b) Using the template in the space provided for your response, construct an appropriately labeled graph that represents the data in Table 1. Determine which species show(s) a difference in the number of mitochondria between normal and elevated levels of CO2.

(c) Based on the data in Table 1, describe the relationship between the level of CO2 and the average number of mitochondria per unit area of a cell.

(d) The leaves of a particular plant species are typically green, but scientists notice a plant in which the leaves have white stripes. They determine that the stripes result from a mutation in mitochondrial DNA that interferes with the development of chloroplasts. The scientists crossed plants using pollen from the plant with white-striped leaves and ovules from a plant with green leaves. Predict the phenotype(s) of the leaves of offspring produced from this cross. Provide reasoning to justify your prediction. Explain why plants with the same genotype are able to differ in the structure and/or number of certain organelles in response to changes in atmospheric levels of CO2.`,
    rubric: [
      {
        id: "r1",
        name: "Part (a) – Inner mitochondrial membrane role",
        points: 1,
        description: "The inner mitochondrial membrane provides the location for the electron transport chain/ATP synthase/oxidative phosphorylation, allows establishment of a proton gradient, and separates the intermembrane space from the matrix.",
        keywords: ["electron transport chain", "ATP synthase", "oxidative phosphorylation", "proton gradient", "intermembrane space", "matrix"],
      },
      {
        id: "r2",
        name: "Part (b) – Graph type",
        points: 1,
        description: "Data are represented in a bar graph or modified bar graph.",
        keywords: ["bar graph", "bar chart"],
      },
      {
        id: "r3",
        name: "Part (b) – Graph labels",
        points: 1,
        description: "Graph is appropriately labeled with axis titles, units (per 100 μm²), and legend distinguishing normal vs. elevated CO2.",
        keywords: ["labeled", "axis", "units", "legend", "CO2", "species", "mitochondria"],
      },
      {
        id: "r4",
        name: "Part (b) – Data accuracy",
        points: 1,
        description: "Data points and error bars are correctly plotted for all six species at both CO2 levels.",
        keywords: ["correctly plotted", "error bars", "six species", "normal", "elevated", "accurate"],
      },
      {
        id: "r5",
        name: "Part (b) – Species with difference",
        points: 1,
        description: "All six species show a statistically significant difference in mitochondria number between normal and elevated CO2 levels (non-overlapping error bars).",
        keywords: ["all species", "all six", "all show difference", "all differ"],
      },
      {
        id: "r6",
        name: "Part (c) – Relationship between CO2 and mitochondria",
        points: 1,
        description: "There is a positive relationship: the number of mitochondria is greater under elevated CO2 conditions than under normal CO2 for all species tested.",
        keywords: ["positive relationship", "greater", "higher", "elevated CO2", "more mitochondria", "positive correlation"],
      },
      {
        id: "r7",
        name: "Part (d) – Leaf phenotype prediction",
        points: 1,
        description: "The leaves of offspring will be green (no white stripes), because the ovule-producing parent has green leaves and mitochondria are maternally inherited.",
        keywords: ["green", "no white stripes", "ovule", "maternal", "all green"],
      },
      {
        id: "r8",
        name: "Part (d) – Maternal inheritance justification",
        points: 1,
        description: "Mitochondria are maternally inherited (transferred via the ovule, not pollen), so the mutation from the pollen parent will not be passed to offspring.",
        keywords: ["maternal inheritance", "mitochondria", "ovule", "not pollen", "maternally inherited", "cytoplasmic inheritance"],
      },
      {
        id: "r9",
        name: "Part (d) – Same genotype, different organelle number",
        points: 1,
        description: "Changes in CO2 levels affect the expression of certain genes (epigenetic/environmental gene regulation), leading to differences in organelle structure or number even in plants with the same genotype.",
        keywords: ["gene expression", "environment", "CO2 levels", "same genotype", "different phenotype", "gene regulation", "epigenetic"],
      },
    ],
  },

  // ── Q3: Sand Lances & Climate Change (Short, 4 pts) ─────────────────────────
  {
    topicSlug: "ecology",
    year: 2023,
    questionNum: 3,
    type: "SHORT" as const,
    difficulty: "EASY" as const,
    totalPoints: 4,
    summary: "Keystone species, experimental design with sand lances, and effects of climate change on coastal ecosystems.",
    imageUrls: [],
    prompt: `Sand lances of the genus Ammodytes are small fish that function as keystone organisms in several coastal ecosystems. These sand lances are prey fish that support organisms at higher trophic levels. Scientists performed experiments to examine how sand lance populations are likely to be affected by the rising temperatures and CO2 levels associated with climate change.

Sand lance embryos typically develop and mature into adult fish at low temperatures (approximately 5°C) and stable, low CO2 levels (approximately 400 μatm). Over the course of two years, the scientists measured the survival rate of sand lance embryos allowed to develop and mature in a laboratory at three different temperatures, 5°C, 7°C, and 10°C, with the level of CO2 maintained at 400 μatm, 1,000 μatm, and 2,100 μatm for each temperature.

(a) Describe the effect of increased biodiversity on the resilience of an ecosystem in a changing environment.

(b) Justify the scientists' selecting 5°C as the lowest temperature and 400 μatm as the lowest CO2 level in their study of sand lance embryo survival.

(c) State a null hypothesis for the experiment.

(d) The scientists claim that a reduction in the population size of the Ammodytes sand lances will affect the stability of the entire coastal ecosystem. Provide reasoning to support the scientists' claim.`,
    rubric: [
      {
        id: "r1",
        name: "Part (a) – Biodiversity and ecosystem resilience",
        points: 1,
        description: "Increased biodiversity increases/improves ecosystem resilience in a changing environment.",
        keywords: ["biodiversity", "resilience", "greater resilience", "increased resilience", "stability", "changing environment"],
      },
      {
        id: "r2",
        name: "Part (b) – Justification of baseline conditions",
        points: 1,
        description: "5°C and 400 μatm are the normal/current conditions at which sand lance embryos develop, so they represent a baseline for comparison with higher temperatures and CO2 levels.",
        keywords: ["normal conditions", "current conditions", "baseline", "basis for comparison", "control", "naturally develop"],
      },
      {
        id: "r3",
        name: "Part (c) – Null hypothesis",
        points: 1,
        description: "Climate change (increases in temperature or CO2 levels) will have no effect on sand lance embryo survival/development/population size. OR: There will be no difference in sand lance survival rates at different temperatures and CO2 levels.",
        keywords: ["no effect", "no difference", "null hypothesis", "temperature", "CO2", "survival", "sand lance"],
      },
      {
        id: "r4",
        name: "Part (d) – Support claim about ecosystem stability",
        points: 1,
        description: "Sand lances are prey fish and keystone organisms; a reduction in their population reduces the energy available to higher trophic levels, negatively affecting the organisms that feed on them and destabilizing the ecosystem.",
        keywords: ["prey", "keystone", "higher trophic levels", "energy", "food source", "ecosystem stability", "organisms that depend"],
      },
    ],
  },

  // ── Q4: Noncyclic & Cyclic Electron Flow (Short, 4 pts) ─────────────────────
  {
    topicSlug: "cellular-energetics",
    year: 2023,
    questionNum: 4,
    type: "SHORT" as const,
    difficulty: "MEDIUM" as const,
    totalPoints: 4,
    summary: "Noncyclic and cyclic electron flow in photosynthesis light reactions, NADPH/NADP+ ratio, and CRR6 mutation effects.",
    imageUrls: ["/frq-images/2023/q4_fig1_cropped.png"],
    prompt: `Noncyclic electron flow and cyclic electron flow are two major pathways of the light-dependent reactions of photosynthesis. In noncyclic electron flow, electrons pass through photosystem II, then components of a chloroplast electron transport chain, and then photosystem I before finally reducing NADP+ to NADPH. In cyclic electron flow, electrons cycle through photosystem I and some components of the electron transport chain (Figure 1).

Figure 1. The pathways of noncyclic and cyclic (heavy arrows) electron flow. The cytochrome complex is a component of the electron transport chain between the two photosystems.

(a) Describe the role of chlorophyll in the photosystems of plant cells.

(b) Based on Figure 1, explain why an increase in the ratio of NADPH to NADP+ will cause an increase in the flow of electrons through the cyclic pathway.

(c) Using rice plants, scientists examined the effect of a mutation that results in the loss of the protein CRR6. CRR6 is a part of the photosystem I complex, and its absence reduces the activity of photosystem I. Predict the effect of the mutation on the rate of biomass (dry weight) accumulation.

(d) Justify your prediction in part (c).`,
    rubric: [
      {
        id: "r1",
        name: "Part (a) – Role of chlorophyll",
        points: 1,
        description: "Chlorophyll captures/absorbs light energy in photosystems; it can also receive electrons from water (in PSII) or transfer electrons to an electron transport chain.",
        keywords: ["absorbs light", "captures light", "light energy", "chlorophyll", "photosystem", "electrons"],
      },
      {
        id: "r2",
        name: "Part (b) – High NADPH/NADP+ ratio and cyclic pathway",
        points: 1,
        description: "When NADPH is high and NADP+ is low, there is insufficient NADP+ to accept electrons from photosystem I via ferredoxin, so electrons are redirected to the cyclic pathway (from ferredoxin to the cytochrome complex) instead.",
        keywords: ["NADP+", "insufficient NADP+", "cannot accept electrons", "cyclic pathway", "ferredoxin", "cytochrome complex", "redirected"],
      },
      {
        id: "r3",
        name: "Part (c) – Predict effect of CRR6 mutation on biomass",
        points: 1,
        description: "The rate of biomass (dry weight) accumulation will decrease/be lower in the mutant rice plants compared to wild-type.",
        keywords: ["decrease", "lower", "less biomass", "reduced", "slower accumulation"],
      },
      {
        id: "r4",
        name: "Part (d) – Justification",
        points: 1,
        description: "Reduced photosystem I activity means less NADPH and ATP are produced; without sufficient NADPH and ATP, the Calvin cycle cannot proceed at a normal rate, so less sugar/carbohydrate is synthesized and biomass accumulation slows.",
        keywords: ["NADPH", "ATP", "Calvin cycle", "carbohydrate synthesis", "insufficient", "less sugar", "photosystem I"],
      },
    ],
  },

  // ── Q5: Ruminant Cladograms (Short, 4 pts) ──────────────────────────────────
  {
    topicSlug: "natural-selection",
    year: 2023,
    questionNum: 5,
    type: "SHORT" as const,
    difficulty: "MEDIUM" as const,
    totalPoints: 4,
    summary: "Phylogenetic analysis of ruminant families using morphological and molecular data; convergent evolution.",
    imageUrls: ["/frq-images/2023/q5_fig1a_cropped.png"],
    prompt: `Ruminants are hoofed animals, including cattle and sheep, that have a unique four-chambered stomach specialized to digest tough, fiber-filled grasses. Researchers studying ruminants are investigating the morphological and molecular characteristics of different ruminant families in order to determine the evolutionary relationships among the families. Cladograms of several ruminant families were constructed based on morphological data (Figure 1A) and molecular data (Figure 1B). Table 1 shows a sample of the morphological characteristics present in each family used to construct the cladogram in Figure 1A.

Figure 1. Cladogram of six ruminant families based on (A) morphological data and (B) molecular data.

TABLE 1. MORPHOLOGICAL CHARACTERISTICS FOUND IN EACH RUMINANT FAMILY

| Characteristic Number | Morphological Characteristic | Tragulidae | Giraffidae | Bovidae | Moschidae | Antilocapridae | Cervidae |
|---|---|---|---|---|---|---|---|
| 1 | Extra tooth material | | | X | | X | |
| 2 | Third stomach | | X | X | X | X | X |
| 3 | Double opening for tear ducts | | | | | X | X |

(a) Describe how a scientist would use a comparison of the DNA sequences of different organisms to suggest the most likely evolutionary relationship among the organisms.

(b) Based on Figure 1, explain why Bovidae is likely to be more closely related to Moschidae than it is to Giraffidae.

(c) Using the template in the space provided for your response, represent the point(s) at which characteristic 1, listed in Table 1, evolved by marking "X" on the line(s) of the cladogram in the correct location(s).

(d) Based on Figure 1A, explain why a characteristic found only in the Cervidae and Bovidae families is more likely evidence of convergent evolution than it is of common ancestry.`,
    rubric: [
      {
        id: "r1",
        name: "Part (a) – Using DNA sequences to determine relationships",
        points: 1,
        description: "Organisms with more similar DNA sequences are more closely related (shared a more recent common ancestor); scientists compare sequences and use degree of similarity to build phylogenetic trees.",
        keywords: ["similar DNA", "closely related", "common ancestor", "DNA sequences", "similarity", "phylogenetic"],
      },
      {
        id: "r2",
        name: "Part (b) – Bovidae closer to Moschidae",
        points: 1,
        description: "The molecular data (Figure 1B) show Bovidae and Moschidae sharing a more recent common ancestor; molecular data are more reliable than morphological data because morphological similarities may result from convergent evolution rather than shared ancestry.",
        keywords: ["molecular data", "Figure 1B", "more reliable", "morphological convergence", "recent common ancestor", "Moschidae"],
      },
      {
        id: "r3",
        name: "Part (c) – Placement of characteristic 1 on cladogram",
        points: 1,
        description: "An X should be placed on the line leading to Bovidae AND an X placed on the line leading to Antilocapridae (separate origins, since they are not sister taxa in Figure 1A).",
        keywords: ["Bovidae", "Antilocapridae", "separate X", "two origins", "independent evolution", "line leading to"],
      },
      {
        id: "r4",
        name: "Part (d) – Convergent evolution vs. common ancestry",
        points: 1,
        description: "In Figure 1A, other families that share the same common ancestor as Bovidae and Cervidae (e.g., Giraffidae, Moschidae, Antilocapridae) do not possess the characteristic, making it more likely the trait arose independently (convergent evolution) than from their common ancestor.",
        keywords: ["convergent evolution", "other families", "common ancestor", "lack the trait", "independent origin", "not shared ancestor", "arose independently"],
      },
    ],
  },

  // ── Q6: Housekeeping Genes & Cq Values (Short, 4 pts) ───────────────────────
  {
    topicSlug: "gene-expression",
    year: 2023,
    questionNum: 6,
    type: "SHORT" as const,
    difficulty: "MEDIUM" as const,
    totalPoints: 4,
    summary: "Housekeeping gene expression in bees, PCR Cq values, control gene selection, and cell-type-specific gene expression.",
    imageUrls: ["/frq-images/2023/q6_fig1_cropped.png"],
    prompt: `Housekeeping genes encode proteins involved in universally important processes such as transcription, translation, and glycolysis. Because these genes appear to be expressed in all cells at constant levels, the expression of housekeeping genes is often used as a control when comparing how the expression of other genes varies under different conditions.

Researchers studying the effect of pesticides on declining bee populations wanted to determine whether the expression of four housekeeping genes (GAPDH, RPL32, RPS5, and TBP-AF) was in fact constant in bees across different variables. The researchers collected samples of mRNA for each of the four genes and compared how their expression varied across the developmental stage of the bee, the sex of the bee, and the cell type from which the sample was taken. The mRNA from the samples was reverse transcribed to produce DNA copies of each gene. PCR was then used to amplify the DNA, and the Cq value was determined. The Cq value is the number of PCR cycles needed to produce a specified number of DNA copies. A high Cq value for a sample indicates the gene was expressed at a low level.

To analyze whether any of the examined variables affected expression of the housekeeping genes, researchers examined the range of Cq values for each gene in response to each variable. Genes with a wide range of Cq values were determined to be affected by the variable, while genes with a narrow range of Cq values were determined to be unaffected by the variable.

Figure 1. The effect of developmental stage, sex, and cell type on the Cq value of four housekeeping genes.

(a) Based on the data in Figure 1, identify the gene that had the lowest median Cq value when bees of different developmental stages were compared.

(b) The Cq value is inversely proportional to the amount of mRNA from that gene in the starting sample. Based on the data in Figure 1, identify the gene that has the lowest level of gene expression regardless of variable.

(c) The scientists investigated the effect of pesticides on the expression of other genes in one cell type of a group of bees containing males and females of the same developmental stage. They hypothesized that TBP-AF would serve as the best control gene for this experiment. Use the data to evaluate their hypothesis.

(d) Explain how expression of a gene such as GAPDH can vary from one cell type to another within the same bee.`,
    rubric: [
      {
        id: "r1",
        name: "Part (a) – Lowest median Cq at developmental stage",
        points: 1,
        description: "RPS5 had the lowest median Cq value when bees of different developmental stages were compared (lower Cq = higher expression).",
        keywords: ["RPS5", "lowest median", "developmental stage", "Cq value"],
      },
      {
        id: "r2",
        name: "Part (b) – Lowest overall gene expression",
        points: 1,
        description: "TBP-AF has the lowest level of gene expression regardless of variable (highest Cq values across all three variables, indicating lowest mRNA abundance).",
        keywords: ["TBP-AF", "highest Cq", "lowest expression", "lowest level", "least expressed"],
      },
      {
        id: "r3",
        name: "Part (c) – Evaluate TBP-AF as control gene",
        points: 1,
        description: "The hypothesis is supported: TBP-AF has the smallest/narrowest Cq range when comparing sexes, indicating its expression is most constant across male and female bees — making it the best control for an experiment comparing sexes at the same developmental stage in one cell type.",
        keywords: ["supported", "TBP-AF", "smallest range", "narrow range", "constant expression", "sex", "best control"],
      },
      {
        id: "r4",
        name: "Part (d) – Cell-type-specific gene expression",
        points: 1,
        description: "Different cell types contain different transcription factors (or different levels of transcription factors) and therefore regulate the expression of genes like GAPDH differently, leading to variation across cell types.",
        keywords: ["transcription factors", "different cell types", "gene regulation", "different levels", "regulate expression", "cell-type specific"],
      },
    ],
  },
]

async function main() {
  console.log("Seeding 2023 AP Biology FRQs...")

  for (const frq of frqs2023) {
    const topic = await prisma.topic.findUnique({ where: { slug: frq.topicSlug } })
    if (!topic) {
      console.error(`  ✗ Topic not found: ${frq.topicSlug}`)
      continue
    }

    await prisma.fRQ.upsert({
      where: { year_questionNum: { year: frq.year, questionNum: frq.questionNum } },
      update: {
        prompt: frq.prompt,
        rubric: frq.rubric,
        imageUrls: frq.imageUrls,
        summary: frq.summary,
        totalPoints: frq.totalPoints,
        type: frq.type,
        difficulty: frq.difficulty,
        topicId: topic.id,
        source: "AP Biology 2023 Official Exam (College Board)",
        isOfficial: true,
      },
      create: {
        year: frq.year,
        questionNum: frq.questionNum,
        type: frq.type,
        difficulty: frq.difficulty,
        topicId: topic.id,
        totalPoints: frq.totalPoints,
        summary: frq.summary,
        prompt: frq.prompt,
        rubric: frq.rubric,
        imageUrls: frq.imageUrls,
        source: "AP Biology 2023 Official Exam (College Board)",
        isOfficial: true,
      },
    })

    console.log(`  ✓ Seeded FRQ: 2023 Q${frq.questionNum} (${frq.topicSlug}) — ${frq.totalPoints} pts`)
  }

  console.log("Done!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
