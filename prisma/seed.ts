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

const topics = [
  { name: "Chemistry of Life", apUnit: 1, slug: "chemistry-of-life" },
  { name: "Cell Structure & Function", apUnit: 2, slug: "cell-structure" },
  { name: "Cellular Energetics", apUnit: 3, slug: "cellular-energetics" },
  { name: "Cell Communication & Cell Cycle", apUnit: 4, slug: "cell-communication" },
  { name: "Heredity", apUnit: 5, slug: "heredity" },
  { name: "Gene Expression & Regulation", apUnit: 6, slug: "gene-expression" },
  { name: "Natural Selection", apUnit: 7, slug: "natural-selection" },
  { name: "Ecology", apUnit: 8, slug: "ecology" },
]

const frqs = [
  // ── Unit 3: Cellular Energetics ─────────────────────────────────────────
  {
    topicSlug: "cellular-energetics",
    year: 2023,
    questionNum: 1,
    type: "LONG" as const,
    difficulty: "MEDIUM" as const,
    totalPoints: 10,
    summary: "Photosynthesis and cellular respiration energy flow in plant cells.",
    prompt: `Photosynthesis and cellular respiration are important chemical reactions that occur in living organisms.

(a) Describe the role of ATP in the energy flow between photosynthesis and cellular respiration in a plant cell. In your description, include where each process occurs in the cell.

(b) A student claims that plants only perform photosynthesis and never perform cellular respiration. Explain why this claim is incorrect. In your response, include TWO pieces of evidence from your knowledge of plant biology.

(c) Carbon dioxide (CO2) levels in a sealed greenhouse were measured over a 24-hour period. During daylight hours, CO2 levels decreased. During nighttime hours, CO2 levels increased. Explain these observations in terms of the relative rates of photosynthesis and cellular respiration.

(d) A student wants to determine the rate of photosynthesis in an aquatic plant. Describe an experimental design the student could use to measure the net rate of photosynthesis. Include the variable being measured and explain how the data would be used to calculate the net rate of photosynthesis.`,
    rubric: [
      {
        id: "r1",
        name: "Part A – ATP and energy flow",
        points: 3,
        description: "Correctly describes ATP as the energy currency, names the location of photosynthesis (chloroplast) and cellular respiration (mitochondria/cytoplasm), and explains the linkage.",
        keywords: ["ATP", "chloroplast", "mitochondria", "light reactions", "Calvin cycle", "glycolysis"],
      },
      {
        id: "r2",
        name: "Part B – Plants perform cellular respiration",
        points: 2,
        description: "Provides TWO valid pieces of evidence: e.g., plants respire at night; plants have mitochondria; plants release CO2 in the dark.",
        keywords: ["mitochondria", "dark", "CO2", "ATP"],
      },
      {
        id: "r3",
        name: "Part C – CO2 levels over 24 hours",
        points: 2,
        description: "Explains that during daylight, photosynthesis rate > respiration rate so CO2 is consumed; at night only respiration occurs so CO2 is released.",
        keywords: ["photosynthesis rate", "respiration rate", "CO2 consumption"],
      },
      {
        id: "r4",
        name: "Part D – Experimental design",
        points: 3,
        description: "Describes a valid experimental setup (e.g., counting O2 bubbles), identifies variables, explains controls, and describes how to calculate net photosynthesis.",
        keywords: ["oxygen bubbles", "oxygen sensor", "independent variable", "control", "net rate"],
      },
    ],
  },
  {
    topicSlug: "cellular-energetics",
    year: 2019,
    questionNum: 1,
    type: "LONG" as const,
    difficulty: "HARD" as const,
    totalPoints: 10,
    summary: "Enzyme function, inhibition, and cellular respiration pathways.",
    prompt: `Enzymes are biological catalysts that play essential roles in metabolic processes including cellular respiration.

(a) Explain how enzyme structure relates to enzyme function. Include a description of the active site and how substrate specificity is determined.

(b) Pyruvate kinase is an enzyme in glycolysis that converts phosphoenolpyruvate (PEP) to pyruvate. ATP is an allosteric inhibitor of pyruvate kinase. Explain how this allosteric inhibition affects glycolysis when ATP levels are high in the cell.

(c) A researcher tests the effect of temperature on enzyme activity and produces a bell-shaped curve. Describe and explain what happens to enzyme activity at temperatures below the optimum, at the optimum, and above the optimum.

(d) Compare the ATP yield from the complete aerobic oxidation of one glucose molecule versus anaerobic fermentation. Explain why cells perform fermentation despite its lower ATP yield.`,
    rubric: [
      {
        id: "r1",
        name: "Part A – Enzyme structure and function",
        points: 3,
        description: "Describes active site complementarity with substrate, induced fit model, and how R-group chemistry determines specificity.",
        keywords: ["active site", "substrate", "induced fit", "specificity", "R-group", "tertiary structure"],
      },
      {
        id: "r2",
        name: "Part B – Allosteric inhibition",
        points: 2,
        description: "Explains that ATP binds to allosteric site (not active site), changes enzyme conformation, reduces activity, slows glycolysis — negative feedback when energy is sufficient.",
        keywords: ["allosteric", "conformation", "negative feedback", "glycolysis", "feedback inhibition"],
      },
      {
        id: "r3",
        name: "Part C – Temperature and enzyme activity",
        points: 3,
        description: "Below optimum: slower molecular movement, fewer collisions, lower rate. At optimum: maximum rate of enzyme-substrate collisions. Above optimum: denaturation of enzyme, loss of active site shape.",
        keywords: ["denaturation", "optimum", "kinetic energy", "collisions", "shape", "denature"],
      },
      {
        id: "r4",
        name: "Part D – Aerobic vs. anaerobic ATP",
        points: 2,
        description: "Aerobic: ~30–32 ATP per glucose; fermentation: 2 ATP. Fermentation allows glycolysis to continue by regenerating NAD+ when oxygen is absent.",
        keywords: ["30-32 ATP", "2 ATP", "NAD+", "regenerate", "oxygen absent", "anaerobic"],
      },
    ],
  },

  // ── Unit 5: Heredity ─────────────────────────────────────────────────────
  {
    topicSlug: "heredity",
    year: 2022,
    questionNum: 2,
    type: "LONG" as const,
    difficulty: "HARD" as const,
    totalPoints: 10,
    summary: "Mendelian genetics, non-Mendelian inheritance, and chi-square analysis.",
    prompt: `A genetics study examines coat color in a population of domestic cats. Researchers determined that coat color is controlled by two genes on different chromosomes.

Gene 1: B (black) is dominant to b (orange)
Gene 2: W (white spotting) is dominant to w (no white spots)

(a) A true-breeding black cat with white spots (BBWW) was crossed with a true-breeding orange cat without white spots (bbww). Determine the genotype and phenotype ratios of the F1 generation. Show your work using a Punnett square or other method.

(b) Two F1 cats from part (a) were crossed to produce the F2 generation. Predict the phenotypic ratio of the F2 generation. Show your work.

(c) A researcher noticed that some F2 cats with the genotype BbWw displayed unexpected orange patches — a condition called tortoiseshell. This occurs only in female cats. Propose a genetic explanation for why tortoiseshell coloration appears only in females.

(d) The researcher collected data from 160 F2 offspring. The observed counts were: Black with spots: 82, Black without spots: 30, Orange with spots: 28, Orange without spots: 20. Using a chi-square analysis, determine whether the observed data support the expected 9:3:3:1 ratio. Show your work and state your conclusion.`,
    rubric: [
      {
        id: "r1",
        name: "Part A – F1 genotype and phenotype",
        points: 2,
        description: "Correctly shows all F1 offspring are BbWw, phenotype is black with white spots (100%).",
        keywords: ["BbWw", "all black", "white spots", "100%"],
      },
      {
        id: "r2",
        name: "Part B – F2 phenotypic ratio",
        points: 2,
        description: "Correctly shows 9:3:3:1 ratio.",
        keywords: ["9:3:3:1", "independent assortment", "dihybrid cross"],
      },
      {
        id: "r3",
        name: "Part C – Tortoiseshell and X-inactivation",
        points: 3,
        description: "Explains X-inactivation (Lyon hypothesis): B gene is X-linked, females (XX) randomly inactivate one X in each cell, producing mosaic of orange and black patches.",
        keywords: ["X-linked", "X-inactivation", "Lyon hypothesis", "heterozygous", "mosaic"],
      },
      {
        id: "r4",
        name: "Part D – Chi-square analysis",
        points: 3,
        description: "Correctly calculates expected values (90, 30, 30, 10), calculates chi-square statistic (~9.87), compares to critical value at df=3 (7.815), concludes data do NOT support expected ratio.",
        keywords: ["chi-square", "expected values", "degrees of freedom", "critical value", "reject null"],
      },
    ],
  },
  {
    topicSlug: "heredity",
    year: 2020,
    questionNum: 3,
    type: "LONG" as const,
    difficulty: "MEDIUM" as const,
    totalPoints: 10,
    summary: "Meiosis, crossing over, and linked genes.",
    prompt: `Meiosis produces genetically diverse gametes through independent assortment and crossing over.

(a) Describe the events of meiosis I that reduce chromosome number from diploid (2n) to haploid (n). Include the role of homologous chromosome pairing and what happens to sister chromatids during this division.

(b) Crossing over occurs during prophase I of meiosis. Explain how crossing over increases genetic variation and describe at what stage of meiosis it is visible as chiasmata.

(c) Two genes — eye color (E/e) and wing shape (V/v) — are located on the same chromosome in Drosophila. A fly with genotype EeVv was crossed with a fly with genotype eevv. The following offspring were obtained:
- EeVv: 43%
- eevv: 43%
- Eevv: 7%
- eeVv: 7%

Calculate the map distance between the two genes. Show your work and explain what the recombinant classes represent.

(d) Explain why genes on the same chromosome do not always show 100% linkage. Include the concept of recombination frequency in your answer.`,
    rubric: [
      {
        id: "r1",
        name: "Part A – Meiosis I events",
        points: 3,
        description: "Describes synapsis of homologs, crossing over in prophase I, alignment at metaphase plate, separation of homologs (not sister chromatids) at anaphase I.",
        keywords: ["synapsis", "homologs", "tetrad", "bivalent", "anaphase I", "independent assortment"],
      },
      {
        id: "r2",
        name: "Part B – Crossing over and chiasmata",
        points: 2,
        description: "Explains crossing over shuffles alleles between homologs creating new combinations; chiasmata visible during prophase I after synapsis.",
        keywords: ["chiasmata", "prophase I", "genetic recombination", "allele shuffle", "synaptonemal complex"],
      },
      {
        id: "r3",
        name: "Part C – Map distance calculation",
        points: 3,
        description: "Recombinant classes = Eevv + eeVv = 14%. Map distance = 14 centiMorgans (cM). Recombinant classes are offspring that resulted from crossing over between the two loci.",
        keywords: ["recombinant", "14%", "14 cM", "map distance", "centiMorgan", "crossing over"],
      },
      {
        id: "r4",
        name: "Part D – Incomplete linkage",
        points: 2,
        description: "Crossing over between linked genes during meiosis I can separate them; the closer genes are, the less frequent recombination; 50% recombination = unlinked.",
        keywords: ["recombination frequency", "crossing over", "distance", "50%", "unlinked"],
      },
    ],
  },

  // ── Unit 6: Gene Expression ───────────────────────────────────────────────
  {
    topicSlug: "gene-expression",
    year: 2021,
    questionNum: 1,
    type: "LONG" as const,
    difficulty: "HARD" as const,
    totalPoints: 10,
    summary: "Gene regulation, lac operon, and eukaryotic transcription factors.",
    prompt: `Gene expression is regulated at multiple levels in both prokaryotes and eukaryotes.

(a) The lac operon in E. coli is regulated by both a repressor and a catabolite activator protein (CAP). Describe how the lac operon is regulated when: (i) Lactose is absent and glucose is present. (ii) Lactose is present and glucose is absent.

(b) Explain why it is advantageous for bacteria to regulate the lac operon using both a repressor mechanism and a CAP activation mechanism, rather than using only one regulatory mechanism.

(c) In eukaryotes, gene expression is regulated differently than in prokaryotes. Describe TWO differences between gene regulation in prokaryotes and eukaryotes. For each difference, explain its significance.

(d) A mutation in the repressor protein of the lac operon results in a repressor that can no longer bind to the operator regardless of whether lactose is present or absent. Predict the effect of this mutation on the expression of the lac operon genes. Justify your prediction.`,
    rubric: [
      {
        id: "r1",
        name: "Part A – Lac operon regulation",
        points: 3,
        description: "For (i): repressor ON, CAP inactive, operon OFF. For (ii): allolactose releases repressor, high cAMP activates CAP, operon maximally ON.",
        keywords: ["repressor", "operator", "allolactose", "CAP", "cAMP", "operon"],
      },
      {
        id: "r2",
        name: "Part B – Advantage of dual regulation",
        points: 2,
        description: "Dual regulation allows response to TWO signals ensuring lac genes expressed only when lactose available AND glucose absent — maximizing metabolic efficiency.",
        keywords: ["catabolite repression", "metabolic efficiency", "glucose preferred", "two signals"],
      },
      {
        id: "r3",
        name: "Part C – Prokaryote vs. eukaryote regulation",
        points: 3,
        description: "Any TWO: chromatin remodeling/histones; enhancers/silencers; mRNA processing; no operons in eukaryotes; nuclear envelope separates transcription and translation.",
        keywords: ["histones", "chromatin", "enhancers", "introns", "splicing", "nuclear membrane"],
      },
      {
        id: "r4",
        name: "Part D – Constitutive expression mutation",
        points: 2,
        description: "Constitutive (always-on) expression because repressor cannot block transcription even when lactose is absent.",
        keywords: ["constitutive", "always expressed", "no repressor binding", "operator"],
      },
    ],
  },
  {
    topicSlug: "gene-expression",
    year: 2018,
    questionNum: 2,
    type: "LONG" as const,
    difficulty: "MEDIUM" as const,
    totalPoints: 10,
    summary: "DNA replication, transcription, translation, and mutations.",
    prompt: `The central dogma of molecular biology describes the flow of genetic information.

(a) Describe the process of DNA replication. In your answer, include the roles of helicase, primase, DNA polymerase, and DNA ligase, and explain why replication is described as semi-conservative.

(b) A gene with the template strand sequence 3'-TACGGATCCTAA-5' is transcribed. Write the mRNA sequence that would be produced and identify the start codon.

(c) Using the mRNA sequence from part (b), describe how a ribosome would translate this mRNA into a polypeptide. Include the roles of the A, P, and E sites and explain the role of tRNA.

(d) A point mutation changes one codon in the gene from part (b) from AUG to AUA. Predict how this mutation would affect the polypeptide produced and explain whether this mutation is a missense, nonsense, or silent mutation. (AUG = Methionine; AUA = Isoleucine)`,
    rubric: [
      {
        id: "r1",
        name: "Part A – DNA replication",
        points: 3,
        description: "Helicase unwinds, primase adds RNA primer, DNA pol III extends 5'→3', DNA pol I removes primer, ligase seals nicks. Semi-conservative: each new molecule has one original and one new strand.",
        keywords: ["helicase", "primase", "DNA polymerase", "ligase", "semi-conservative", "leading strand", "lagging strand", "Okazaki"],
      },
      {
        id: "r2",
        name: "Part B – Transcription / mRNA sequence",
        points: 2,
        description: "mRNA: 5'-AUGCCUAGGAUU-3'. Start codon is AUG (codes for methionine).",
        keywords: ["AUG", "start codon", "mRNA", "5' to 3'", "complementary"],
      },
      {
        id: "r3",
        name: "Part C – Translation",
        points: 3,
        description: "Ribosome scans for AUG; A site binds incoming aminoacyl-tRNA; peptide bond forms in P site; E site releases empty tRNA; ribosome translocates; polypeptide grows.",
        keywords: ["A site", "P site", "E site", "tRNA", "anticodon", "peptide bond", "translocation", "codon"],
      },
      {
        id: "r4",
        name: "Part D – Point mutation",
        points: 2,
        description: "Missense mutation — AUG→AUA changes methionine to isoleucine; polypeptide has a different amino acid at that position. May or may not affect protein function depending on location.",
        keywords: ["missense", "amino acid change", "methionine", "isoleucine", "point mutation"],
      },
    ],
  },

  // ── Unit 7: Natural Selection ─────────────────────────────────────────────
  {
    topicSlug: "natural-selection",
    year: 2022,
    questionNum: 5,
    type: "SHORT" as const,
    difficulty: "MEDIUM" as const,
    totalPoints: 4,
    summary: "Hardy-Weinberg equilibrium and conditions that disrupt it.",
    prompt: `A population of beetles has two phenotypes for shell color: green (dominant allele G) and brown (recessive allele g). In a sample of 200 beetles, 50 are brown (gg).

(a) Assuming the population is in Hardy-Weinberg equilibrium, calculate the expected frequency of the heterozygous genotype (Gg). Show your work.

(b) Identify TWO conditions required for a population to be in Hardy-Weinberg equilibrium and explain how violating each condition would affect allele frequencies.`,
    rubric: [
      {
        id: "r1",
        name: "Part A – Hardy-Weinberg calculation",
        points: 2,
        description: "q² = 0.25, q = 0.5, p = 0.5, 2pq = 0.5 (50% heterozygous, 100 individuals).",
        keywords: ["q²", "q", "p", "2pq", "0.5", "50%"],
      },
      {
        id: "r2",
        name: "Part B – HWE conditions",
        points: 2,
        description: "Any TWO of: no natural selection; no mutation; no gene flow; random mating; large population (no genetic drift).",
        keywords: ["natural selection", "mutation", "gene flow", "random mating", "genetic drift"],
      },
    ],
  },
  {
    topicSlug: "natural-selection",
    year: 2017,
    questionNum: 3,
    type: "LONG" as const,
    difficulty: "MEDIUM" as const,
    totalPoints: 10,
    summary: "Evidence for evolution, speciation, and phylogenetics.",
    prompt: `Evolution is supported by multiple lines of evidence and results in the diversification of species.

(a) Describe THREE independent lines of evidence that support the theory of evolution by natural selection. For each line of evidence, explain how it supports the theory.

(b) Explain the difference between allopatric and sympatric speciation. For each type, provide an example of a mechanism that could lead to reproductive isolation.

(c) A phylogenetic tree shows the following relationships: Species A and B share a common ancestor 5 million years ago (mya), and Species A/B share a common ancestor with Species C at 20 mya. Based on this tree, which two species would you predict to have the most similar DNA sequences? Explain your reasoning.

(d) Antibiotic resistance in bacteria is often cited as direct evidence of evolution by natural selection. Explain the steps by which a bacterial population could evolve resistance to an antibiotic, applying the four key components of natural selection.`,
    rubric: [
      {
        id: "r1",
        name: "Part A – Lines of evidence",
        points: 3,
        description: "Any THREE: fossil record; comparative anatomy (homologous/analogous); molecular/DNA evidence; biogeography; comparative embryology; direct observation.",
        keywords: ["fossil", "homologous", "DNA", "biogeography", "embryology", "molecular"],
      },
      {
        id: "r2",
        name: "Part B – Allopatric vs. sympatric speciation",
        points: 3,
        description: "Allopatric: geographic barrier separates populations (e.g., mountain range, river). Sympatric: speciation without geographic isolation (e.g., polyploidy in plants, habitat specialization).",
        keywords: ["allopatric", "geographic isolation", "sympatric", "polyploidy", "reproductive isolation"],
      },
      {
        id: "r3",
        name: "Part C – Phylogenetic tree interpretation",
        points: 2,
        description: "Species A and B would have the most similar DNA because they share a more recent common ancestor (5 mya vs. 20 mya) — less time for mutations to accumulate.",
        keywords: ["common ancestor", "recent", "similar DNA", "divergence", "mutations"],
      },
      {
        id: "r4",
        name: "Part D – Antibiotic resistance evolution",
        points: 2,
        description: "Variation exists in resistance; selection pressure (antibiotic) kills susceptibles; resistant individuals survive and reproduce; resistance allele increases in frequency — inherited by offspring.",
        keywords: ["variation", "selection", "survival", "reproduction", "allele frequency", "heritable"],
      },
    ],
  },

  // ── Unit 8: Ecology ───────────────────────────────────────────────────────
  {
    topicSlug: "ecology",
    year: 2023,
    questionNum: 4,
    type: "SHORT" as const,
    difficulty: "EASY" as const,
    totalPoints: 4,
    summary: "Population ecology: density-dependent factors and carrying capacity.",
    prompt: `A population of white-tailed deer in a national park has been monitored for 20 years. The population grew rapidly for the first 10 years and then stabilized near 500 individuals.

(a) Identify the type of population growth demonstrated during the first 10 years and explain ONE characteristic of this growth pattern.

(b) The population stabilized at approximately 500 individuals. Identify the ecological term for this value and explain TWO density-dependent factors that could have contributed to the population stabilizing.`,
    rubric: [
      {
        id: "r1",
        name: "Part A – Growth type",
        points: 1,
        description: "Identifies logistic or exponential growth; correctly describes one characteristic.",
        keywords: ["logistic", "exponential", "J-curve", "resources", "birth rate"],
      },
      {
        id: "r2",
        name: "Part B – Carrying capacity and density-dependent factors",
        points: 3,
        description: "Names 'carrying capacity' (K), identifies TWO valid density-dependent factors: food competition, disease, predation, intraspecific competition.",
        keywords: ["carrying capacity", "K", "competition", "predation", "disease", "density-dependent"],
      },
    ],
  },
  {
    topicSlug: "ecology",
    year: 2016,
    questionNum: 2,
    type: "LONG" as const,
    difficulty: "MEDIUM" as const,
    totalPoints: 10,
    summary: "Energy flow through ecosystems and trophic levels.",
    prompt: `Energy flows through ecosystems from producers to consumers.

(a) Explain why energy transfer between trophic levels is inefficient. In your response, include the approximate percentage of energy transferred between trophic levels and describe what happens to the energy that is NOT transferred.

(b) A grassland ecosystem contains the following trophic levels: grasses (producers), grasshoppers (primary consumers), frogs (secondary consumers), snakes (tertiary consumers), and hawks (quaternary consumers). If the grasses fix 100,000 kcal of energy, calculate the energy available to hawks. Show your work using the 10% rule.

(c) Compare the rates of primary productivity in a tropical rainforest and a desert ecosystem. Explain the abiotic factors responsible for the difference in productivity.

(d) Explain how the removal of a keystone predator (such as wolves from Yellowstone) can affect the entire ecosystem, including abiotic factors. This concept is known as a trophic cascade.`,
    rubric: [
      {
        id: "r1",
        name: "Part A – Energy transfer inefficiency",
        points: 2,
        description: "~10% transferred between trophic levels; remaining 90% lost as heat (respiration), used for metabolism, or in uneaten biomass/decomposition.",
        keywords: ["10%", "heat", "respiration", "metabolism", "trophic level"],
      },
      {
        id: "r2",
        name: "Part B – Energy calculation",
        points: 3,
        description: "100,000 → 10,000 (grasshoppers) → 1,000 (frogs) → 100 (snakes) → 10 kcal (hawks). Hawks receive 10 kcal.",
        keywords: ["10,000", "1,000", "100", "10 kcal", "10%", "hawks"],
      },
      {
        id: "r3",
        name: "Part C – Primary productivity comparison",
        points: 3,
        description: "Tropical rainforest: high productivity due to abundant sunlight, water, warmth, and nutrients. Desert: low productivity due to water limitation, extreme temperatures.",
        keywords: ["sunlight", "water", "temperature", "nutrients", "abiotic", "limiting factor"],
      },
      {
        id: "r4",
        name: "Part D – Trophic cascade",
        points: 2,
        description: "Removing wolves → deer population explodes → overgrazing → loss of vegetation → bank erosion → changes stream hydrology. Indirect effects on abiotic factors.",
        keywords: ["trophic cascade", "keystone", "wolves", "deer", "overgrazing", "vegetation", "abiotic"],
      },
    ],
  },

  // ── Unit 2: Cell Structure ────────────────────────────────────────────────
  {
    topicSlug: "cell-structure",
    year: 2015,
    questionNum: 1,
    type: "LONG" as const,
    difficulty: "MEDIUM" as const,
    totalPoints: 10,
    summary: "Cell membranes, transport, and osmosis.",
    prompt: `The plasma membrane regulates the movement of substances into and out of cells.

(a) Describe the fluid mosaic model of the plasma membrane. Include the roles of phospholipids, cholesterol, and membrane proteins in membrane structure and function.

(b) Compare and contrast simple diffusion, facilitated diffusion, and active transport. For each, state whether energy is required and give ONE example of a molecule transported by that mechanism.

(c) A red blood cell is placed in a hypotonic solution. Predict what will happen to the cell and explain the osmotic process driving this change. Use the terms water potential, solute concentration, and osmosis in your answer.

(d) The sodium-potassium pump (Na+/K+ ATPase) moves 3 Na+ out of the cell and 2 K+ into the cell per cycle, using one ATP. Explain why this pump is essential for maintaining the resting membrane potential of neurons and describe what would happen if this pump were inhibited.`,
    rubric: [
      {
        id: "r1",
        name: "Part A – Fluid mosaic model",
        points: 3,
        description: "Phospholipid bilayer with hydrophilic heads/hydrophobic tails; cholesterol increases fluidity/stability; integral and peripheral proteins for transport/signaling/adhesion.",
        keywords: ["phospholipid bilayer", "hydrophilic", "hydrophobic", "cholesterol", "fluidity", "integral protein", "peripheral protein"],
      },
      {
        id: "r2",
        name: "Part B – Types of transport",
        points: 3,
        description: "Simple diffusion: no energy, small/nonpolar (O2, CO2). Facilitated diffusion: no energy, channel/carrier protein (glucose, ions). Active transport: ATP required, against gradient (Na+/K+ pump).",
        keywords: ["simple diffusion", "facilitated diffusion", "active transport", "ATP", "concentration gradient", "channel protein", "carrier protein"],
      },
      {
        id: "r3",
        name: "Part C – Osmosis in hypotonic solution",
        points: 2,
        description: "Cell gains water by osmosis (lysis/bursting). Hypotonic: lower solute outside → higher water potential outside → water moves in by osmosis. Red blood cell lyses.",
        keywords: ["hypotonic", "osmosis", "lysis", "water potential", "solute concentration", "net movement"],
      },
      {
        id: "r4",
        name: "Part D – Na+/K+ pump",
        points: 2,
        description: "Maintains concentration gradients for Na+ and K+; keeps inside of cell negative relative to outside; inhibition would depolarize the membrane, preventing action potential propagation.",
        keywords: ["resting potential", "depolarize", "Na+", "K+", "concentration gradient", "action potential"],
      },
    ],
  },

  // ── Unit 4: Cell Communication ────────────────────────────────────────────
  {
    topicSlug: "cell-communication",
    year: 2020,
    questionNum: 1,
    type: "LONG" as const,
    difficulty: "HARD" as const,
    totalPoints: 10,
    summary: "Signal transduction pathways and the cell cycle.",
    prompt: `Cells communicate through signal transduction pathways that regulate cellular processes including the cell cycle.

(a) Describe the three stages of cell signaling (reception, transduction, response). For each stage, identify the cellular component involved and describe what occurs.

(b) Epinephrine (adrenaline) signals cells through a G-protein coupled receptor (GPCR) linked to adenylyl cyclase. Describe the sequence of molecular events from epinephrine binding to its receptor through the activation of protein kinase A (PKA). Include the role of cAMP as a second messenger.

(c) The cell cycle is regulated at checkpoints. Describe what occurs at the G1/S checkpoint and the G2/M checkpoint, and explain how CDK-cyclin complexes control passage through these checkpoints.

(d) Mutations in proto-oncogenes and tumor suppressor genes can lead to cancer. Compare these two types of mutations. For each, identify ONE specific gene example and describe how the mutation disrupts normal cell cycle control.`,
    rubric: [
      {
        id: "r1",
        name: "Part A – Three stages of cell signaling",
        points: 3,
        description: "Reception: receptor protein binds ligand (signal molecule). Transduction: cascade of molecular changes (relay proteins, second messengers). Response: activation of protein/gene expression change.",
        keywords: ["reception", "transduction", "response", "receptor", "ligand", "second messenger", "relay protein"],
      },
      {
        id: "r2",
        name: "Part B – GPCR/epinephrine pathway",
        points: 3,
        description: "Epinephrine binds GPCR → G-protein activates adenylyl cyclase → ATP→cAMP → cAMP activates PKA → PKA phosphorylates target proteins.",
        keywords: ["GPCR", "G-protein", "adenylyl cyclase", "cAMP", "PKA", "phosphorylation", "second messenger"],
      },
      {
        id: "r3",
        name: "Part C – Cell cycle checkpoints",
        points: 2,
        description: "G1/S: checks for DNA damage, adequate size, growth signals; CDK4/6-cyclinD required. G2/M: checks DNA replication complete, no damage; CDK1-cyclinB (MPF) required.",
        keywords: ["G1/S", "G2/M", "CDK", "cyclin", "checkpoint", "DNA damage", "MPF"],
      },
      {
        id: "r4",
        name: "Part D – Proto-oncogenes vs. tumor suppressors",
        points: 2,
        description: "Proto-oncogene: gain-of-function mutation → oncogene → overactive growth signal (e.g., Ras). Tumor suppressor: loss-of-function → cell cycle not braked (e.g., p53, Rb).",
        keywords: ["proto-oncogene", "oncogene", "tumor suppressor", "gain-of-function", "loss-of-function", "p53", "Ras", "Rb"],
      },
    ],
  },

  // ── Unit 1: Chemistry of Life ─────────────────────────────────────────────
  {
    topicSlug: "chemistry-of-life",
    year: 2014,
    questionNum: 1,
    type: "LONG" as const,
    difficulty: "EASY" as const,
    totalPoints: 10,
    summary: "Macromolecules: structure, function, and synthesis/hydrolysis reactions.",
    prompt: `Biological macromolecules are essential for life and are built from monomers.

(a) For EACH of the four major classes of biological macromolecules (carbohydrates, lipids, proteins, nucleic acids), identify the monomer(s) and describe ONE major function in a living organism.

(b) Explain the role of dehydration synthesis (condensation) and hydrolysis reactions in the formation and breakdown of polymers. Give a specific example of each reaction using one class of macromolecule.

(c) Proteins are composed of amino acids and fold into complex three-dimensional shapes. Describe the four levels of protein structure (primary, secondary, tertiary, quaternary) and explain what type of chemical interaction stabilizes each level.

(d) A student tests an unknown substance with Benedict's reagent (turns orange/red with reducing sugars) and with the biuret reagent (turns purple with proteins). The substance tests positive for Benedict's and negative for biuret. Identify what class of macromolecule is likely present and explain why the other reagent test was negative.`,
    rubric: [
      {
        id: "r1",
        name: "Part A – Macromolecule monomers and functions",
        points: 3,
        description: "Carbohydrates: monosaccharides, energy storage/structural. Lipids: fatty acids + glycerol, energy storage/membranes. Proteins: amino acids, enzymes/structural/signaling. Nucleic acids: nucleotides, genetic information/protein synthesis.",
        keywords: ["monosaccharide", "amino acid", "nucleotide", "fatty acid", "glycerol", "enzyme", "genetic information"],
      },
      {
        id: "r2",
        name: "Part B – Dehydration and hydrolysis",
        points: 2,
        description: "Dehydration synthesis: monomers joined by removing water, forming covalent bond (e.g., two glucose → maltose + H2O). Hydrolysis: water added to break bond (e.g., sucrose + H2O → glucose + fructose).",
        keywords: ["dehydration synthesis", "condensation", "hydrolysis", "water", "covalent bond", "polymer"],
      },
      {
        id: "r3",
        name: "Part C – Protein structure levels",
        points: 3,
        description: "Primary: amino acid sequence, peptide bonds. Secondary: alpha-helix/beta-sheet, hydrogen bonds. Tertiary: 3D folding, R-group interactions (hydrophobic, disulfide, H-bonds, ionic). Quaternary: multiple polypeptides, same interactions.",
        keywords: ["primary", "secondary", "tertiary", "quaternary", "peptide bond", "hydrogen bond", "R-group", "disulfide", "alpha-helix", "beta-sheet"],
      },
      {
        id: "r4",
        name: "Part D – Reagent test interpretation",
        points: 2,
        description: "Carbohydrate (reducing sugar) is present. Negative biuret means no protein. The substance has reducing sugars (free aldehyde/ketone groups react with Benedict's) but lacks the peptide bonds needed for biuret reaction.",
        keywords: ["reducing sugar", "carbohydrate", "Benedict's", "biuret", "peptide bond", "aldehyde"],
      },
    ],
  },
]

// ─── MCQ Questions ────────────────────────────────────────────────────────────

const mcqs = [
  // ── Unit 1: Chemistry of Life ─────────────────────────────────────────────
  {
    question: "Which property of water allows it to moderate temperature changes in organisms?",
    options: { A: "High surface tension", B: "High specific heat", C: "Low density as ice", D: "Cohesion between molecules" },
    answer: "B",
    explanation: "Water has a high specific heat capacity, meaning it absorbs or releases large amounts of heat energy before changing temperature. This property helps organisms resist rapid temperature fluctuations.",
    unit: 1, topicSlug: "chemistry-of-life", difficulty: "EASY" as const, year: null,
  },
  {
    question: "A peptide bond forms between two amino acids via which type of reaction?",
    options: { A: "Hydrolysis", B: "Oxidative phosphorylation", C: "Dehydration synthesis", D: "Phosphorylation" },
    answer: "C",
    explanation: "Dehydration synthesis (condensation) joins amino acids by removing a water molecule, forming a covalent peptide bond between the carboxyl group of one amino acid and the amino group of the next.",
    unit: 1, topicSlug: "chemistry-of-life", difficulty: "EASY" as const, year: null,
  },
  {
    question: "Which of the following macromolecules serves as the primary long-term energy storage molecule in animals?",
    options: { A: "Glycogen", B: "Starch", C: "Triglycerides", D: "Cellulose" },
    answer: "C",
    explanation: "Triglycerides (fats/lipids) are the primary long-term energy storage in animals, yielding more than twice the energy per gram compared to carbohydrates. Glycogen is short-term storage.",
    unit: 1, topicSlug: "chemistry-of-life", difficulty: "EASY" as const, year: null,
  },
  {
    question: "The alpha helix and beta pleated sheet are examples of which level of protein structure?",
    options: { A: "Primary structure", B: "Secondary structure", C: "Tertiary structure", D: "Quaternary structure" },
    answer: "B",
    explanation: "Secondary structure refers to local folding of the polypeptide chain into alpha helices and beta pleated sheets, stabilized by hydrogen bonds between backbone atoms.",
    unit: 1, topicSlug: "chemistry-of-life", difficulty: "EASY" as const, year: null,
  },
  {
    question: "Which of the following best describes the function of phospholipids in a biological membrane?",
    options: { A: "They act as enzymes that catalyze membrane reactions", B: "They form a bilayer with hydrophobic tails facing inward", C: "They actively transport ions across the membrane", D: "They store energy for membrane maintenance" },
    answer: "B",
    explanation: "Phospholipids have hydrophilic heads and hydrophobic tails. In aqueous environments, they spontaneously arrange into a bilayer with tails facing inward (away from water), forming the structural basis of all biological membranes.",
    unit: 1, topicSlug: "chemistry-of-life", difficulty: "EASY" as const, year: null,
  },
  {
    question: "A solution has a pH of 3. Compared to a solution with a pH of 5, the pH-3 solution has:",
    options: { A: "10 times fewer hydrogen ions", B: "2 times more hydrogen ions", C: "100 times more hydrogen ions", D: "100 times fewer hydrogen ions" },
    answer: "C",
    explanation: "The pH scale is logarithmic. A difference of 2 pH units means 10² = 100-fold difference. pH 3 is more acidic (more H⁺) than pH 5, so the pH-3 solution has 100 times more hydrogen ions.",
    unit: 1, topicSlug: "chemistry-of-life", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "Enzymes lower the activation energy of a reaction by:",
    options: { A: "Increasing the temperature of the reaction", B: "Providing energy to start the reaction", C: "Stabilizing the transition state of the reaction", D: "Changing the free energy of the products" },
    answer: "C",
    explanation: "Enzymes lower activation energy by stabilizing the transition state, orienting substrates properly in the active site, and sometimes participating in chemical steps. They do not change the overall free energy (ΔG) of the reaction.",
    unit: 1, topicSlug: "chemistry-of-life", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "Which type of bond gives water its cohesive and adhesive properties?",
    options: { A: "Covalent bonds between O and H", B: "Hydrogen bonds between water molecules", C: "Ionic bonds between Na⁺ and Cl⁻", D: "Van der Waals interactions" },
    answer: "B",
    explanation: "Hydrogen bonds between the partial negative charge on oxygen and partial positive charge on hydrogen of neighboring water molecules create cohesion (water-water attraction) and adhesion (water-other substance attraction).",
    unit: 1, topicSlug: "chemistry-of-life", difficulty: "EASY" as const, year: null,
  },

  // ── Unit 2: Cell Structure & Function ────────────────────────────────────
  {
    question: "Which organelle is responsible for modifying, sorting, and packaging proteins for secretion?",
    options: { A: "Rough endoplasmic reticulum", B: "Smooth endoplasmic reticulum", C: "Golgi apparatus", D: "Lysosome" },
    answer: "C",
    explanation: "The Golgi apparatus (Golgi complex) receives proteins from the ER, modifies them (e.g., adds carbohydrates), sorts them, and packages them into vesicles for secretion or delivery to organelles.",
    unit: 2, topicSlug: "cell-structure", difficulty: "EASY" as const, year: null,
  },
  {
    question: "The endomembrane system includes which of the following organelles?",
    options: { A: "Mitochondria and chloroplasts", B: "Endoplasmic reticulum, Golgi, and lysosomes", C: "Ribosomes and nucleus only", D: "Peroxisomes and vacuoles only" },
    answer: "B",
    explanation: "The endomembrane system includes the nuclear envelope, ER, Golgi apparatus, lysosomes, vesicles, and the plasma membrane — all functionally connected through vesicular transport.",
    unit: 2, topicSlug: "cell-structure", difficulty: "EASY" as const, year: null,
  },
  {
    question: "A cell placed in a hypertonic solution will:",
    options: { A: "Swell and possibly lyse", B: "Remain unchanged due to homeostasis", C: "Lose water and shrink (crenate/plasmolyze)", D: "Gain solutes to equalize concentration" },
    answer: "C",
    explanation: "In a hypertonic solution, solute concentration is higher outside the cell. Water moves out of the cell by osmosis (from low solute to high solute), causing the cell to lose water and shrink.",
    unit: 2, topicSlug: "cell-structure", difficulty: "EASY" as const, year: null,
  },
  {
    question: "Which of the following is NOT a characteristic of prokaryotic cells?",
    options: { A: "No membrane-bound nucleus", B: "Ribosomes present", C: "DNA in nucleoid region", D: "Membrane-bound organelles" },
    answer: "D",
    explanation: "Prokaryotic cells lack membrane-bound organelles including a nucleus, mitochondria, ER, and Golgi. They do have ribosomes (70S), DNA, plasma membrane, and cell wall.",
    unit: 2, topicSlug: "cell-structure", difficulty: "EASY" as const, year: null,
  },
  {
    question: "Aquaporins increase the rate of which process across the plasma membrane?",
    options: { A: "Active transport of glucose", B: "Osmosis (water movement)", C: "Endocytosis", D: "Na⁺/K⁺ pumping" },
    answer: "B",
    explanation: "Aquaporins are channel proteins that dramatically increase the permeability of the membrane to water, facilitating osmosis without energy expenditure.",
    unit: 2, topicSlug: "cell-structure", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "The sodium-potassium pump moves ions against their concentration gradients using ATP. This is an example of:",
    options: { A: "Simple diffusion", B: "Facilitated diffusion", C: "Active transport", D: "Endocytosis" },
    answer: "C",
    explanation: "Active transport moves molecules against their concentration gradient and requires energy (ATP). The Na⁺/K⁺ pump uses one ATP to move 3 Na⁺ out and 2 K⁺ in against their gradients.",
    unit: 2, topicSlug: "cell-structure", difficulty: "EASY" as const, year: null,
  },
  {
    question: "According to the endosymbiotic theory, mitochondria evolved from:",
    options: { A: "Infolding of the plasma membrane", B: "Ancient photosynthetic bacteria engulfed by a host cell", C: "Ancient aerobic bacteria engulfed by a host cell", D: "The nuclear envelope budding off" },
    answer: "C",
    explanation: "The endosymbiotic theory proposes that mitochondria evolved from ancient aerobic bacteria (proteobacteria) engulfed by a host cell. Evidence includes their own circular DNA, 70S ribosomes, and double membrane.",
    unit: 2, topicSlug: "cell-structure", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "Which structure controls the movement of materials into and out of the nucleus?",
    options: { A: "Nucleolus", B: "Nuclear pore complexes", C: "Smooth ER", D: "Chromatin" },
    answer: "B",
    explanation: "Nuclear pore complexes are large protein channels in the nuclear envelope that regulate the import of proteins (like transcription factors) and export of RNA molecules.",
    unit: 2, topicSlug: "cell-structure", difficulty: "EASY" as const, year: null,
  },

  // ── Unit 3: Cellular Energetics ───────────────────────────────────────────
  {
    question: "During the light-dependent reactions of photosynthesis, water molecules are split in a process called:",
    options: { A: "Carbon fixation", B: "Photorespiration", C: "Photolysis", D: "Chemiosmosis" },
    answer: "C",
    explanation: "Photolysis is the light-driven splitting of water molecules (2H₂O → 4H⁺ + 4e⁻ + O₂) in Photosystem II. The electrons replace those lost by P680, and O₂ is released as a byproduct.",
    unit: 3, topicSlug: "cellular-energetics", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "Which of the following correctly describes the role of NADH in cellular respiration?",
    options: { A: "It acts as an electron donor in the electron transport chain", B: "It directly synthesizes ATP in the mitochondrial matrix", C: "It is the final electron acceptor in aerobic respiration", D: "It splits glucose into pyruvate during glycolysis" },
    answer: "A",
    explanation: "NADH is an electron carrier that donates its electrons to Complex I of the electron transport chain. This drives proton pumping across the inner mitochondrial membrane, ultimately powering ATP synthesis.",
    unit: 3, topicSlug: "cellular-energetics", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "In the Calvin cycle, what molecule directly accepts CO₂ during carbon fixation?",
    options: { A: "G3P (glyceraldehyde-3-phosphate)", B: "RuBP (ribulose-1,5-bisphosphate)", C: "ATP", D: "NADPH" },
    answer: "B",
    explanation: "RuBisCO catalyzes the addition of CO₂ to RuBP (a 5-carbon molecule), producing two 3-carbon molecules of 3-PGA. This is the carbon fixation step of the Calvin cycle.",
    unit: 3, topicSlug: "cellular-energetics", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "Where does the Krebs cycle (citric acid cycle) occur in eukaryotic cells?",
    options: { A: "Cytoplasm", B: "Inner mitochondrial membrane", C: "Mitochondrial matrix", D: "Thylakoid membrane" },
    answer: "C",
    explanation: "The Krebs cycle occurs in the mitochondrial matrix. Pyruvate from glycolysis is transported into the matrix, converted to acetyl-CoA, and enters the cycle to produce NADH, FADH₂, and CO₂.",
    unit: 3, topicSlug: "cellular-energetics", difficulty: "EASY" as const, year: null,
  },
  {
    question: "Which process generates the MOST ATP during aerobic cellular respiration?",
    options: { A: "Glycolysis", B: "Pyruvate oxidation", C: "Krebs cycle", D: "Oxidative phosphorylation" },
    answer: "D",
    explanation: "Oxidative phosphorylation (chemiosmosis via ATP synthase) generates approximately 26–28 of the ~30–32 total ATP per glucose. The ETC uses electrons from NADH and FADH₂ to drive proton pumping.",
    unit: 3, topicSlug: "cellular-energetics", difficulty: "EASY" as const, year: null,
  },
  {
    question: "Fermentation allows glycolysis to continue under anaerobic conditions by:",
    options: { A: "Generating additional ATP", B: "Regenerating NAD⁺ from NADH", C: "Producing oxygen as a byproduct", D: "Converting pyruvate to acetyl-CoA" },
    answer: "B",
    explanation: "Fermentation oxidizes NADH back to NAD⁺, which is required for glycolysis to continue. Without this regeneration, glycolysis would halt due to NAD⁺ depletion. Only 2 ATP are produced (from glycolysis).",
    unit: 3, topicSlug: "cellular-energetics", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "Which pigment is most abundant in plant leaves and reflects green light?",
    options: { A: "Carotenoid", B: "Xanthophyll", C: "Phytochrome", D: "Chlorophyll a" },
    answer: "D",
    explanation: "Chlorophyll a is the primary photosynthetic pigment in plants and algae. It absorbs red and blue-violet light most strongly and reflects green light, which is why leaves appear green.",
    unit: 3, topicSlug: "cellular-energetics", difficulty: "EASY" as const, year: null,
  },
  {
    question: "The chemiosmotic gradient used to synthesize ATP in mitochondria is formed by:",
    options: { A: "Active transport of glucose into the matrix", B: "Pumping of protons from the matrix to the intermembrane space", C: "Direct phosphorylation of ADP by substrate-level reactions", D: "The diffusion of NADH across the inner membrane" },
    answer: "B",
    explanation: "As electrons flow down the ETC, Complexes I, III, and IV pump H⁺ from the matrix to the intermembrane space, creating a proton gradient. H⁺ flows back through ATP synthase, driving ATP synthesis.",
    unit: 3, topicSlug: "cellular-energetics", difficulty: "MEDIUM" as const, year: null,
  },

  // ── Unit 4: Cell Communication & Cell Cycle ───────────────────────────────
  {
    question: "Which type of cell signaling involves a cell secreting molecules that affect adjacent cells?",
    options: { A: "Endocrine signaling", B: "Paracrine signaling", C: "Autocrine signaling", D: "Synaptic signaling" },
    answer: "B",
    explanation: "Paracrine signaling involves the secretion of local chemical mediators that diffuse to and affect neighboring cells. Growth factors are a common example. Endocrine signaling acts over long distances via the bloodstream.",
    unit: 4, topicSlug: "cell-communication", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "During which phase of the cell cycle is DNA replicated?",
    options: { A: "G1", B: "G2", C: "S phase", D: "M phase" },
    answer: "C",
    explanation: "DNA replication occurs exclusively during S phase (Synthesis phase) of interphase. The cell duplicates its entire genome so each daughter cell will receive a complete copy.",
    unit: 4, topicSlug: "cell-communication", difficulty: "EASY" as const, year: null,
  },
  {
    question: "What is the function of cyclin proteins in the cell cycle?",
    options: { A: "They directly replicate DNA", B: "They degrade damaged chromosomes", C: "They activate CDKs (cyclin-dependent kinases) to advance the cell cycle", D: "They repair DNA double-strand breaks" },
    answer: "C",
    explanation: "Cyclins are regulatory proteins whose levels fluctuate throughout the cell cycle. They bind and activate CDKs, which then phosphorylate target proteins to drive progression through cell cycle checkpoints.",
    unit: 4, topicSlug: "cell-communication", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "A ligand binds to an intracellular receptor. What does this indicate about the ligand?",
    options: { A: "It is a large hydrophilic molecule", B: "It is a small hydrophobic molecule that can cross the membrane", C: "It requires a second messenger system", D: "It activates a G-protein coupled pathway" },
    answer: "B",
    explanation: "Intracellular receptors are located in the cytoplasm or nucleus. Ligands that bind them must be small and hydrophobic (nonpolar) to diffuse through the lipid bilayer. Steroid hormones and thyroid hormones are examples.",
    unit: 4, topicSlug: "cell-communication", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "The G₁/S checkpoint in the cell cycle primarily monitors:",
    options: { A: "Whether chromosomes are properly attached to spindle fibers", B: "Whether DNA replication was completed without errors", C: "Whether the cell has adequate size, nutrients, and undamaged DNA to replicate", D: "Whether cytokinesis is proceeding correctly" },
    answer: "C",
    explanation: "The G₁/S checkpoint (restriction point in mammals) ensures the cell is large enough, nutrients are available, external growth signals are present, and DNA is undamaged before committing to DNA replication.",
    unit: 4, topicSlug: "cell-communication", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "Which of the following describes a proto-oncogene?",
    options: { A: "A gene that always inhibits cell division", B: "A normal gene that promotes cell growth; becomes an oncogene when mutated", C: "A gene that triggers apoptosis", D: "A non-coding region of DNA" },
    answer: "B",
    explanation: "Proto-oncogenes are normal genes encoding proteins that stimulate cell growth and division (e.g., growth factor receptors, Ras). Gain-of-function mutations convert them to oncogenes that cause uncontrolled proliferation.",
    unit: 4, topicSlug: "cell-communication", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "cAMP (cyclic AMP) functions in signal transduction as a:",
    options: { A: "Primary messenger receptor", B: "Enzyme that breaks down ATP", C: "Second messenger that amplifies the signal inside the cell", D: "G-protein that activates adenylyl cyclase" },
    answer: "C",
    explanation: "cAMP is a second messenger produced by adenylyl cyclase from ATP. It amplifies the signal by activating protein kinase A (PKA), which phosphorylates multiple target proteins, triggering a cellular response.",
    unit: 4, topicSlug: "cell-communication", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "During which stage of mitosis do sister chromatids separate and move to opposite poles?",
    options: { A: "Prophase", B: "Metaphase", C: "Anaphase", D: "Telophase" },
    answer: "C",
    explanation: "During anaphase of mitosis, the cohesin proteins holding sister chromatids together are cleaved, and the spindle fibers shorten, pulling sister chromatids to opposite poles of the cell.",
    unit: 4, topicSlug: "cell-communication", difficulty: "EASY" as const, year: null,
  },

  // ── Unit 5: Heredity ──────────────────────────────────────────────────────
  {
    question: "In a dihybrid cross between two AaBb individuals, what fraction of offspring will be aabb?",
    options: { A: "1/4", B: "1/8", C: "1/16", D: "1/2" },
    answer: "C",
    explanation: "For each gene independently: probability of aa = 1/4, probability of bb = 1/4. Combined probability = 1/4 × 1/4 = 1/16 by the multiplication rule (independent assortment).",
    unit: 5, topicSlug: "heredity", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "A sex-linked recessive trait appears more often in males than females because:",
    options: { A: "Males have two X chromosomes and are more susceptible", B: "Males have only one X chromosome, so one recessive allele is sufficient for expression", C: "The Y chromosome carries dominant alleles that suppress the trait in females", D: "Sex-linked traits are only inherited from the father" },
    answer: "B",
    explanation: "Males are hemizygous for X-linked genes (only one X). A single recessive allele on their X chromosome will be expressed because there is no second allele to mask it. Females need two recessive alleles.",
    unit: 5, topicSlug: "heredity", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "Which of the following is an example of incomplete dominance?",
    options: { A: "ABO blood type inheritance", B: "A cross between red and white snapdragons producing pink offspring", C: "Hemophilia expressed only in males", D: "Height controlled by many genes" },
    answer: "B",
    explanation: "Incomplete dominance produces an intermediate phenotype in heterozygotes. Red × white snapdragons produce pink offspring because neither allele is fully dominant — partial expression of both alleles results in a blended phenotype.",
    unit: 5, topicSlug: "heredity", difficulty: "EASY" as const, year: null,
  },
  {
    question: "During meiosis II, what separates?",
    options: { A: "Homologous chromosomes", B: "Sister chromatids", C: "Tetrads", D: "Bivalents" },
    answer: "B",
    explanation: "Meiosis I separates homologous chromosomes; Meiosis II separates sister chromatids (like mitosis). The result is four haploid cells, each with unreplicated chromosomes.",
    unit: 5, topicSlug: "heredity", difficulty: "EASY" as const, year: null,
  },
  {
    question: "Crossing over during meiosis increases genetic variation by:",
    options: { A: "Doubling the number of chromosomes", B: "Exchanging segments between non-sister chromatids of homologous chromosomes", C: "Causing random chromosome segregation", D: "Duplicating entire chromosomes" },
    answer: "B",
    explanation: "During prophase I, non-sister chromatids of homologous chromosomes exchange segments at chiasmata (crossover points), creating chromosomes with new combinations of alleles from both parents.",
    unit: 5, topicSlug: "heredity", difficulty: "EASY" as const, year: null,
  },
  {
    question: "If two genes are 30 map units apart, approximately what percentage of offspring from a testcross would show recombinant phenotypes?",
    options: { A: "10%", B: "20%", C: "30%", D: "50%" },
    answer: "C",
    explanation: "Map distance in centimorgans (cM) equals the recombination frequency in percent. 30 map units = 30% recombinant offspring in a testcross. If distance exceeds 50 cM, genes appear unlinked.",
    unit: 5, topicSlug: "heredity", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "A woman who is a carrier for color blindness (X^B X^b) has children with a color-blind man (X^b Y). What is the probability that their son will be color blind?",
    options: { A: "25%", B: "50%", C: "75%", D: "100%" },
    answer: "B",
    explanation: "Sons receive the Y from father and X from mother. Mother is X^B X^b, so she passes X^B or X^b each with 50% probability. Sons who receive X^b (50%) will be color blind; X^B sons (50%) will have normal vision.",
    unit: 5, topicSlug: "heredity", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "Which of the following describes pleiotropy?",
    options: { A: "One trait is controlled by many genes", B: "One gene affects many different phenotypic traits", C: "Two alleles are both fully expressed in heterozygotes", D: "The environment controls gene expression" },
    answer: "B",
    explanation: "Pleiotropy occurs when a single gene has multiple phenotypic effects. Example: the gene causing sickle-cell disease affects red blood cell shape, oxygen transport, pain crises, and organ damage.",
    unit: 5, topicSlug: "heredity", difficulty: "MEDIUM" as const, year: null,
  },

  // ── Unit 6: Gene Expression & Regulation ─────────────────────────────────
  {
    question: "Which enzyme catalyzes the synthesis of mRNA from a DNA template?",
    options: { A: "DNA polymerase I", B: "Helicase", C: "RNA polymerase", D: "Reverse transcriptase" },
    answer: "C",
    explanation: "RNA polymerase synthesizes mRNA in the 5'→3' direction using the template (antisense) strand of DNA as a guide. In prokaryotes, sigma factor helps RNA polymerase find the promoter.",
    unit: 6, topicSlug: "gene-expression", difficulty: "EASY" as const, year: null,
  },
  {
    question: "Which of the following describes the role of the 5' cap and poly-A tail added to eukaryotic mRNA?",
    options: { A: "They serve as the start and stop codons for translation", B: "They protect mRNA from degradation and assist in ribosome binding and export", C: "They signal the mRNA to return to the nucleus", D: "They are recognition sites for spliceosomes to remove introns" },
    answer: "B",
    explanation: "The 5' 7-methylguanosine cap and 3' poly-A tail protect eukaryotic mRNA from exonuclease degradation, facilitate nuclear export, and assist in ribosome recognition during translation initiation.",
    unit: 6, topicSlug: "gene-expression", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "A mutation that changes a codon from UGG (Trp) to UAG would be classified as a:",
    options: { A: "Silent mutation", B: "Missense mutation", C: "Nonsense mutation", D: "Frameshift mutation" },
    answer: "C",
    explanation: "UAG is a stop codon. A mutation that changes an amino acid codon to a stop codon is a nonsense mutation. It causes premature termination of translation, typically producing a truncated, nonfunctional protein.",
    unit: 6, topicSlug: "gene-expression", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "In the lac operon, which condition leads to maximum transcription of the structural genes?",
    options: { A: "Glucose present, lactose absent", B: "Glucose absent, lactose present", C: "Both glucose and lactose present", D: "Both glucose and lactose absent" },
    answer: "B",
    explanation: "Maximum transcription requires: (1) lactose present (allolactose releases repressor from operator) AND (2) glucose absent (high cAMP activates CAP, enhancing RNA polymerase binding). Both signals together = maximum expression.",
    unit: 6, topicSlug: "gene-expression", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "MicroRNAs (miRNAs) regulate gene expression by:",
    options: { A: "Methylating DNA promoters to silence genes", B: "Binding to complementary mRNA sequences to block translation or cause degradation", C: "Recruiting RNA polymerase to enhance transcription", D: "Deacetylating histones to condense chromatin" },
    answer: "B",
    explanation: "miRNAs are ~22-nucleotide RNA molecules that base-pair with complementary sequences in target mRNAs. This either blocks ribosome translation or targets the mRNA for degradation by the RISC complex.",
    unit: 6, topicSlug: "gene-expression", difficulty: "HARD" as const, year: null,
  },
  {
    question: "Histone acetylation generally leads to:",
    options: { A: "Tighter chromatin packing and reduced transcription", B: "Looser chromatin structure and increased transcription", C: "DNA replication initiation", D: "mRNA degradation" },
    answer: "B",
    explanation: "Acetylation of histone tails (by histone acetyltransferases) reduces the positive charge of histones, weakening their interaction with negatively charged DNA. This opens chromatin, making genes more accessible to transcription machinery.",
    unit: 6, topicSlug: "gene-expression", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "Which of the following is TRUE about the genetic code?",
    options: { A: "It is ambiguous — one codon can code for multiple amino acids", B: "It is universal — the same codons specify the same amino acids in nearly all organisms", C: "It is non-redundant — each amino acid is specified by exactly one codon", D: "It contains 64 amino acids" },
    answer: "B",
    explanation: "The genetic code is nearly universal (with minor exceptions in mitochondria and some protists). It is also redundant (multiple codons can specify the same amino acid) and unambiguous (one codon = one amino acid).",
    unit: 6, topicSlug: "gene-expression", difficulty: "EASY" as const, year: null,
  },
  {
    question: "In eukaryotes, enhancer sequences activate transcription by:",
    options: { A: "Directly binding RNA polymerase at the transcription start site", B: "Binding activator proteins that interact with the basal transcription complex via DNA looping", C: "Methylating the promoter region", D: "Producing siRNA to activate translation" },
    answer: "B",
    explanation: "Enhancers can be thousands of base pairs from the promoter. Activator proteins bind enhancers, and DNA loops bring them into contact with the transcription initiation complex, stimulating RNA polymerase activity.",
    unit: 6, topicSlug: "gene-expression", difficulty: "HARD" as const, year: null,
  },

  // ── Unit 7: Natural Selection ─────────────────────────────────────────────
  {
    question: "Which of the following is a requirement for natural selection to occur in a population?",
    options: { A: "All individuals must have the same phenotype", B: "Heritable variation in traits that affect reproductive success must exist", C: "The environment must remain constant over time", D: "Mutations must occur in every generation" },
    answer: "B",
    explanation: "Natural selection requires: (1) variation in traits, (2) heritability of those traits, and (3) differential reproductive success. Without heritable variation, selection has nothing to act upon.",
    unit: 7, topicSlug: "natural-selection", difficulty: "EASY" as const, year: null,
  },
  {
    question: "Two species that evolved similar structures independently in different lineages due to similar environmental pressures are said to show:",
    options: { A: "Homology", B: "Vestigial evolution", C: "Divergent evolution", D: "Convergent evolution" },
    answer: "D",
    explanation: "Convergent evolution is the independent evolution of similar structures (analogous structures) in unrelated lineages due to similar selective pressures. Example: wings of birds and bats (homologous) vs. wings of birds and insects (analogous/convergent).",
    unit: 7, topicSlug: "natural-selection", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "In a population of birds, intermediate beak size is favored over very large or very small beaks. This is an example of:",
    options: { A: "Directional selection", B: "Disruptive selection", C: "Stabilizing selection", D: "Sexual selection" },
    answer: "C",
    explanation: "Stabilizing selection favors intermediate phenotypes and reduces variation in the population. It acts against both extremes. Human birth weight is a classic example: very low or very high birth weights have lower survival.",
    unit: 7, topicSlug: "natural-selection", difficulty: "EASY" as const, year: null,
  },
  {
    question: "The bottleneck effect is an example of:",
    options: { A: "Natural selection acting on favorable alleles", B: "Gene flow between two populations", C: "Genetic drift following a drastic reduction in population size", D: "Sexual selection reducing variation" },
    answer: "C",
    explanation: "The bottleneck effect occurs when a population is drastically reduced (e.g., by a natural disaster), and the surviving population has reduced genetic diversity due to chance. This is a form of genetic drift.",
    unit: 7, topicSlug: "natural-selection", difficulty: "EASY" as const, year: null,
  },
  {
    question: "Which observation provides direct molecular evidence for a common ancestor between humans and chimpanzees?",
    options: { A: "Both organisms have bilateral symmetry", B: "Their DNA sequences are approximately 98-99% identical", C: "Both organisms require oxygen for survival", D: "They both have vertebral columns" },
    answer: "B",
    explanation: "Molecular evidence — the ~98-99% similarity in DNA sequences between humans and chimpanzees — provides strong evidence for a recent common ancestor. The more recently species diverged, the more similar their DNA.",
    unit: 7, topicSlug: "natural-selection", difficulty: "EASY" as const, year: null,
  },
  {
    question: "Which of the following would cause allele frequencies to change in a population but is NOT natural selection?",
    options: { A: "Organisms with beneficial mutations producing more offspring", B: "A hurricane killing half the population at random (genetic drift)", C: "Predators preferentially eating individuals with a certain phenotype", D: "Organisms with certain traits having higher mate success" },
    answer: "B",
    explanation: "Genetic drift causes random changes in allele frequency due to chance events. A hurricane killing individuals randomly (not based on fitness) is genetic drift, not natural selection, which requires differential survival based on traits.",
    unit: 7, topicSlug: "natural-selection", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "Geographical isolation leading to the formation of two new species from one ancestral population is called:",
    options: { A: "Sympatric speciation", B: "Adaptive radiation", C: "Allopatric speciation", D: "Convergent speciation" },
    answer: "C",
    explanation: "Allopatric speciation occurs when a population is divided by a geographic barrier (mountain range, ocean, river). Isolated populations diverge due to different selective pressures, mutations, and drift, eventually becoming reproductively isolated.",
    unit: 7, topicSlug: "natural-selection", difficulty: "EASY" as const, year: null,
  },
  {
    question: "In the Hardy-Weinberg equation p² + 2pq + q² = 1, what does 2pq represent?",
    options: { A: "Frequency of homozygous dominant individuals", B: "Frequency of heterozygous individuals", C: "Frequency of homozygous recessive individuals", D: "Frequency of the dominant allele" },
    answer: "B",
    explanation: "In the Hardy-Weinberg model, p² = frequency of homozygous dominant (AA), q² = homozygous recessive (aa), and 2pq = heterozygous (Aa). The term 2pq arises because there are two ways to get the Aa genotype.",
    unit: 7, topicSlug: "natural-selection", difficulty: "EASY" as const, year: null,
  },

  // ── Unit 8: Ecology ───────────────────────────────────────────────────────
  {
    question: "Which of the following best describes a keystone species?",
    options: { A: "The most abundant species in an ecosystem", B: "A species that has a disproportionately large effect on its ecosystem relative to its biomass", C: "A species that produces the most energy in an ecosystem", D: "A species that forms the base of the food chain" },
    answer: "B",
    explanation: "A keystone species has a disproportionately large effect on ecosystem structure relative to its abundance. Removing a keystone species causes dramatic changes. Sea otters (controlling sea urchins) and wolves (Yellowstone) are classic examples.",
    unit: 8, topicSlug: "ecology", difficulty: "EASY" as const, year: null,
  },
  {
    question: "In an ecological pyramid of energy, approximately what percentage of energy is transferred from one trophic level to the next?",
    options: { A: "1%", B: "10%", C: "50%", D: "90%" },
    answer: "B",
    explanation: "The 10% rule states that approximately 10% of energy is transferred from one trophic level to the next. The remaining ~90% is lost as heat (through respiration and metabolic processes).",
    unit: 8, topicSlug: "ecology", difficulty: "EASY" as const, year: null,
  },
  {
    question: "A population that grows exponentially and then levels off at carrying capacity shows which type of growth curve?",
    options: { A: "J-shaped curve", B: "S-shaped (logistic) curve", C: "Bell-shaped curve", D: "Exponential decay curve" },
    answer: "B",
    explanation: "Logistic growth produces an S-shaped (sigmoid) curve. The population grows rapidly at first (exponential phase), then growth slows as it approaches carrying capacity (K) due to resource limitations.",
    unit: 8, topicSlug: "ecology", difficulty: "EASY" as const, year: null,
  },
  {
    question: "Which of the following describes a mutualistic relationship?",
    options: { A: "A tick feeding on a deer's blood", B: "A clownfish living among sea anemone tentacles, both benefiting", C: "A cuckoo bird laying eggs in another bird's nest", D: "A large tree shading and inhibiting smaller plants beneath it" },
    answer: "B",
    explanation: "Mutualism is a symbiotic relationship where both species benefit (+/+). The clownfish receives protection from predators; the anemone receives cleaning and aeration. Ticks are parasitism (+/-); the cuckoo is brood parasitism.",
    unit: 8, topicSlug: "ecology", difficulty: "EASY" as const, year: null,
  },
  {
    question: "The carbon cycle returns CO₂ to the atmosphere through which process(es)?",
    options: { A: "Photosynthesis only", B: "Cellular respiration and decomposition", C: "Nitrogen fixation", D: "Primary productivity" },
    answer: "B",
    explanation: "CO₂ is released to the atmosphere primarily through cellular respiration (by all organisms) and decomposition (by bacteria and fungi breaking down organic matter). Photosynthesis removes CO₂ from the atmosphere.",
    unit: 8, topicSlug: "ecology", difficulty: "EASY" as const, year: null,
  },
  {
    question: "Which of the following is a density-INDEPENDENT factor that can limit population growth?",
    options: { A: "Competition for food", B: "Predation", C: "A severe drought", D: "Disease" },
    answer: "C",
    explanation: "Density-independent factors affect populations regardless of population size. Abiotic factors like drought, floods, fire, and extreme temperatures are density-independent. Competition, predation, and disease are density-dependent.",
    unit: 8, topicSlug: "ecology", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "Nitrogen fixation, the conversion of atmospheric N₂ to NH₃ (ammonia), is carried out by:",
    options: { A: "Plants through photosynthesis", B: "Animals through excretion", C: "Specialized bacteria such as Rhizobium", D: "Decomposers breaking down organic matter" },
    answer: "C",
    explanation: "Only certain prokaryotes (e.g., Rhizobium in root nodules of legumes, free-living Azotobacter, cyanobacteria) have the enzyme nitrogenase to convert atmospheric N₂ into biologically available NH₃.",
    unit: 8, topicSlug: "ecology", difficulty: "MEDIUM" as const, year: null,
  },
  {
    question: "In ecological succession, which of the following best describes a pioneer species?",
    options: { A: "The dominant species at the climax community", B: "A species that arrives last in primary succession", C: "The first organisms to colonize a barren environment, often tolerating harsh conditions", D: "A species that replaces the previous community in secondary succession" },
    answer: "C",
    explanation: "Pioneer species are the first colonizers of a newly barren environment (primary succession), such as lichens on bare rock. They tolerate harsh conditions and modify the environment to allow other species to establish.",
    unit: 8, topicSlug: "ecology", difficulty: "EASY" as const, year: null,
  },
]

// ─── Seed function ────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding topics...")
  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { slug: topic.slug },
      update: {},
      create: topic,
    })
  }

  console.log("Seeding FRQs...")
  for (const frq of frqs) {
    const topic = await prisma.topic.findUnique({ where: { slug: frq.topicSlug } })
    if (!topic) {
      console.error(`Topic not found: ${frq.topicSlug}`)
      continue
    }
    await prisma.fRQ.upsert({
      where: { year_questionNum: { year: frq.year, questionNum: frq.questionNum } },
      update: {},
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
        imageUrls: [],
        source: "AI-generated practice question (AP Biology curriculum)",
        isOfficial: false,
      },
    })
    console.log(`  Seeded FRQ: ${frq.year} Q${frq.questionNum} (${frq.topicSlug})`)
  }

  console.log("Seeding MCQs...")
  let mcqCount = 0
  for (const mcq of mcqs) {
    await prisma.mCQ.create({ data: mcq })
    mcqCount++
  }
  console.log(`  Seeded ${mcqCount} MCQs`)

  console.log("Done!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
