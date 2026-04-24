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

const frqs2024 = [
  // ── Q1: Meiosis Crossing Over & Kinetochore Proteins (Long, 9 pts) ──────────
  {
    topicSlug: "heredity",
    year: 2024,
    questionNum: 1,
    type: "LONG" as const,
    difficulty: "HARD" as const,
    totalPoints: 9,
    summary: "Meiotic crossing over, kinetochore proteins suppressing recombination, fluorescent marker experiment, and genetic diversity.",
    imageUrls: [
      "/frq-images/2024/q1_fig1_cropped.png",
      "/frq-images/2024/q1_fig2_cropped.png",
    ],
    prompt: `Crossing over in meiosis I is required for homologous chromosomes to properly align during metaphase and segregate during the first cell division.

(a)
(i) Describe the function of S phase of interphase.

Some regions of a chromosome called hotspots display a higher frequency of crossing over than other regions do. Crossing over is suppressed in chromosomal regions near the centromeres. The centromere region of a duplicated chromosome includes a collection of proteins that form a structure called the kinetochore. Scientists hypothesized that one or more of these kinetochore proteins are responsible for suppressing crossing over around the centromere.

To investigate their hypothesis, scientists modified chromosome 8 in yeast such that, in each cell, one chromosome from the pair of homologous chromosome 8s contained the gene encoding red fluorescent protein (RFP), while the other chromosome from the pair contained the gene encoding green fluorescent protein (GFP). Cells expressing RFP emit red light, and cells expressing GFP emit green light. Models of the modified chromosome 8 both before and after crossing over are shown in Figure 1.

Figure 1. Models of modified chromosome 8 used in the experiment (A) before and (B) after crossing over occurs at the hotspot.

(ii) Explain why some haploid cells formed after meiosis in this experiment will have only one fluorescent marker.

The scientists then investigated whether attaching individual kinetochore proteins to a specific DNA sequence present in a known crossing-over hotspot on chromosome 8 affected the frequency of crossing over at this location. In their first experiment, they examined three groups of yeast cells containing the modified chromosome 8. Group 1 contained no kinetochore proteins attached to the hotspot, group 2 contained the kinetochore protein CTF attached to the hotspot, and group 3 contained the kinetochore protein IML attached to the hotspot. For each group, the scientists determined the frequency of crossing over between the RFP and GFP genes. To determine the frequency, the scientists added the number of cells emitting both red and green light to the number of cells that emitted no light and divided by the total number of cells (Figure 2).

Figure 2. The frequency of crossing over in a hotspot on yeast chromosome 8 for cell groups treated with different kinetochore proteins. Error bars represent ±2SE.

(b)
(i) Identify the control group for the scientists' first experiment, shown in Figure 2.
(ii) In a follow-up experiment, the scientists created a modified version of CTF in which the DNA-binding portion had been removed. They compared the frequency of crossing over in yeast cells in the presence and absence of unmodified CTF with that in yeast cells in the presence and absence of the modified CTF protein. In the follow-up experiment, justify why the scientists used a modified CTF protein that is unable to bind to DNA as a control.
(iii) Identify the independent variable in the follow-up experiment.

(c) Based on Figure 2, describe the effect on the frequency of crossing over when CTF is attached to the chromosome 8 hotspot compared with the effect when IML is attached to the hotspot.

(d)
(i) Predict the effect on the number of copies of chromosome 8 likely to be present in the resulting daughter cells when CTF is attached to the hotspot.
(ii) Provide reasoning to justify your prediction.
(iii) Explain how the presence of hotspots (Figure 1) could increase the likelihood that a population will survive in the presence of selective pressures.`,
    rubric: [
      {
        id: "r1",
        name: "Part (a)(i) – S phase function",
        points: 1,
        description: "The function of S phase is to replicate/duplicate/synthesize the DNA/chromosomes, doubling the amount of DNA in the cell.",
        keywords: ["replicate DNA", "duplicate DNA", "DNA synthesis", "chromosomes duplicated", "S phase", "double the DNA"],
      },
      {
        id: "r2",
        name: "Part (a)(ii) – Haploid cells with one fluorescent marker",
        points: 1,
        description: "Some cells will receive a chromatid that did not undergo crossing over at the hotspot, so it retains only RFP or only GFP. Alternatively, two crossing-over events could restore the original arrangement.",
        keywords: ["no crossing over", "only RFP", "only GFP", "one marker", "did not recombine", "chromatid without crossing over"],
      },
      {
        id: "r3",
        name: "Part (b)(i) – Control group",
        points: 1,
        description: "Group 1 (no kinetochore proteins attached / 'None') is the control group.",
        keywords: ["Group 1", "None", "no kinetochore protein", "no protein attached", "control"],
      },
      {
        id: "r4",
        name: "Part (b)(ii) – Justification for modified CTF control",
        points: 1,
        description: "Using a modified CTF that cannot bind DNA allows scientists to determine whether DNA binding of the CTF protein is necessary for suppressing crossing over, or whether just the presence of CTF protein (without DNA binding) is sufficient to affect recombination frequency.",
        keywords: ["DNA binding", "necessary", "presence of CTF", "whether binding required", "just protein presence", "determine if DNA binding"],
      },
      {
        id: "r5",
        name: "Part (b)(iii) – Independent variable",
        points: 1,
        description: "The type of CTF used (unmodified CTF vs. modified CTF that cannot bind DNA, or presence/absence of each).",
        keywords: ["type of CTF", "modified vs unmodified", "DNA-binding portion", "independent variable", "presence or absence of CTF"],
      },
      {
        id: "r6",
        name: "Part (c) – CTF vs. IML effect on crossing over",
        points: 1,
        description: "CTF attachment results in a decreased/lower frequency of crossing over compared to the control, whereas IML attachment results in a similar or higher frequency of crossing over compared to the control — CTF suppresses recombination while IML does not.",
        keywords: ["CTF decreases", "lower frequency", "IML no effect", "IML higher", "CTF suppresses", "compared to control"],
      },
      {
        id: "r7",
        name: "Part (d)(i) – Chromosome 8 copies in daughter cells",
        points: 1,
        description: "There will be zero or two copies of chromosome 8 in resulting daughter cells (nondisjunction), or one less/one extra copy.",
        keywords: ["zero", "two copies", "nondisjunction", "incorrect number", "one less", "one extra", "abnormal"],
      },
      {
        id: "r8",
        name: "Part (d)(ii) – Justification for abnormal chromosome number",
        points: 1,
        description: "With CTF reducing crossing over frequency, homologous chromosomes are less likely to form chiasmata, which are required for proper alignment and segregation; without proper alignment, nondisjunction is more likely, resulting in abnormal chromosome numbers.",
        keywords: ["chiasmata", "alignment", "segregation", "nondisjunction", "proper segregation", "crossing over required", "alignment failure"],
      },
      {
        id: "r9",
        name: "Part (d)(iii) – Hotspots and population survival",
        points: 1,
        description: "Hotspots increase the rate of genetic recombination, creating more genetic diversity in the population; with greater diversity, it is more likely that some individuals possess traits that allow them to survive and reproduce under new selective pressures.",
        keywords: ["genetic diversity", "variation", "recombination", "hotspots", "some individuals survive", "selective pressures", "diversity"],
      },
    ],
  },

  // ── Q2: Toad Liver Cells & Temperature/ATP (Long, 9 pts) ────────────────────
  {
    topicSlug: "cellular-energetics",
    year: 2024,
    questionNum: 2,
    type: "LONG" as const,
    difficulty: "MEDIUM" as const,
    totalPoints: 9,
    summary: "Temperature effects on oxygen consumption and ATP synthesis in toad liver cells; graphing and oligomycin inhibition of ATP synthase.",
    imageUrls: [],
    prompt: `To investigate how increases in environmental temperatures affect the metabolism of certain organisms, researchers incubated liver cells from toads at different temperatures and measured two markers of metabolic activity (Table 1): the rate of oxygen consumption and the rate of ATP synthesis.

(a) Describe the role of water in the hydrolysis of ATP.

TABLE 1. RATE OF OXYGEN CONSUMPTION AND ATP SYNTHESIS AT DIFFERENT TEMPERATURES

| Metabolic Marker | 20°C | 25°C | 30°C |
|---|---|---|---|
| Rate of Oxygen Consumption (nmol/min/mg of mitochondrial protein, avg ±2SE) | 12.8 ± 2.2 | 16.5 ± 2.0 | 22.1 ± 0.7 |
| Rate of ATP Synthesis (nmol/min/mg of mitochondrial protein, avg ±2SE) | 12.6 ± 1.6 | 16.8 ± 2.0 | 21.07 ± 0.8 |

(b)
(i) Using the template in the space provided for your response, construct a bar graph that represents the data shown in Table 1. Your graph should be appropriately plotted and labeled.
(ii) Based on the data provided, determine the temperature in °C at which the rate of oxygen consumption is different from the rate of oxygen consumption at 25°C.

(c)
(i) Based on the data in Table 1, describe the effect of temperature on the rate of ATP synthesis in liver cells from toads.
(ii) Based on the data in Table 1, calculate the average amount of oxygen consumed, in nmol, for 10 mg of mitochondrial protein after 10 minutes at 25°C.

(d)
(i) Oligomycin is a compound that can block the channel protein function of ATP synthase. Predict the effects of using oligomycin on the proton gradient across the inner mitochondrial membrane.
(ii) Justify your prediction.`,
    rubric: [
      {
        id: "r1",
        name: "Part (a) – Role of water in ATP hydrolysis",
        points: 1,
        description: "Water is added in the process of cleaving/splitting a phosphate group from ATP (hydrolysis breaks the phosphoanhydride bond using water).",
        keywords: ["water added", "cleaving", "splitting", "hydrolysis", "phosphate", "ATP breakdown", "water breaks ATP"],
      },
      {
        id: "r2",
        name: "Part (b)(i) – Graph type",
        points: 1,
        description: "Data are represented in a bar graph.",
        keywords: ["bar graph", "bar chart"],
      },
      {
        id: "r3",
        name: "Part (b)(i) – Graph labels",
        points: 1,
        description: "Graph is appropriately labeled (axes titled with units, legend or color coding distinguishing oxygen consumption from ATP synthesis, temperatures on x-axis).",
        keywords: ["labeled", "axis", "units", "nmol/min/mg", "temperature", "legend", "title"],
      },
      {
        id: "r4",
        name: "Part (b)(i) – Data accuracy",
        points: 1,
        description: "Data points and error bars are correctly plotted for both metabolic markers at all three temperatures.",
        keywords: ["correctly plotted", "error bars", "accurate", "both markers", "three temperatures"],
      },
      {
        id: "r5",
        name: "Part (b)(ii) – Temperature different from 25°C",
        points: 1,
        description: "30°C is the temperature at which the rate of oxygen consumption is statistically different from that at 25°C (non-overlapping error bars: 22.1 ± 0.7 vs. 16.5 ± 2.0).",
        keywords: ["30°C", "30 degrees", "statistically different", "non-overlapping", "error bars"],
      },
      {
        id: "r6",
        name: "Part (c)(i) – Temperature effect on ATP synthesis",
        points: 1,
        description: "As temperature increases (from 20°C to 30°C), the rate of ATP synthesis also increases — a positive relationship between temperature and ATP synthesis rate.",
        keywords: ["increases", "positive relationship", "higher temperature", "higher ATP synthesis", "directly correlated", "as temperature increases"],
      },
      {
        id: "r7",
        name: "Part (c)(ii) – Oxygen consumption calculation",
        points: 1,
        description: "1,650 nmol: 16.5 nmol/min/mg × 10 mg × 10 min = 1,650 nmol.",
        keywords: ["1650", "1,650", "nmol", "16.5", "10 mg", "10 minutes", "calculation"],
      },
      {
        id: "r8",
        name: "Part (d)(i) – Oligomycin prediction on proton gradient",
        points: 1,
        description: "The proton gradient across the inner mitochondrial membrane will increase (become steeper) because protons can no longer flow back into the matrix through the blocked ATP synthase channel.",
        keywords: ["proton gradient increases", "steeper gradient", "increase", "protons accumulate", "intermembrane space", "blocked ATP synthase"],
      },
      {
        id: "r9",
        name: "Part (d)(ii) – Justification",
        points: 1,
        description: "With ATP synthase blocked, protons pumped into the intermembrane space by the electron transport chain cannot flow back into the matrix, so they accumulate in the intermembrane space, increasing the proton gradient.",
        keywords: ["cannot flow back", "accumulate", "intermembrane space", "electron transport chain still pumping", "protons build up", "ATP synthase blocked"],
      },
    ],
  },

  // ── Q3: Red Blood Cells & Glucose Transport (Short, 4 pts) ──────────────────
  {
    topicSlug: "cell-structure",
    year: 2024,
    questionNum: 3,
    type: "SHORT" as const,
    difficulty: "EASY" as const,
    totalPoints: 4,
    summary: "Facilitated diffusion of glucose into aging red blood cells and experimental design controls.",
    imageUrls: [],
    prompt: `To investigate whether red blood cells of animals lose the ability to take in glucose from their environment as they age, scientists collected red blood cells from guinea pigs that ranged in age from one day old to seven months old. Scientists incubated an equal number of red blood cells in separate culture dishes that contained a 300 nM solution of radioactively labeled glucose. The amount of radioactively labeled glucose present inside the red blood cells of each group was measured over time.

(a) Describe a difference between passive transport and active transport.

(b) Justify why the scientists used an equal number of red blood cells in each culture dish as a control.

(c) Glucose transporters are required for the facilitated diffusion of glucose into red blood cells. The scientists claim that the expression of the gene encoding these transporters decreases as guinea pigs age. If the scientists' claim is supported by experimental data, predict the effect of increased age on the amount of radioactively labeled glucose present inside the cells of each group.

(d) Justify your prediction in part (c).`,
    rubric: [
      {
        id: "r1",
        name: "Part (a) – Passive vs. active transport",
        points: 1,
        description: "Active transport requires energy/ATP while passive transport does not. OR: Passive transport moves substances from high to low concentration; active transport moves substances from low to high concentration (against the gradient).",
        keywords: ["active transport requires energy", "ATP", "passive no energy", "concentration gradient", "against gradient", "high to low", "low to high"],
      },
      {
        id: "r2",
        name: "Part (b) – Justification for equal number of cells",
        points: 1,
        description: "Using equal numbers of cells controls for cell number as a variable, allowing any differences in glucose uptake to be attributed to guinea pig age rather than the number of cells in each dish.",
        keywords: ["equal number", "controls for", "cell number", "attribute differences to age", "eliminate variable", "compare groups", "same number"],
      },
      {
        id: "r3",
        name: "Part (c) – Prediction on glucose uptake with age",
        points: 1,
        description: "As guinea pig age increases, the amount of radioactively labeled glucose inside the cells will decrease (older red blood cells will take in less glucose).",
        keywords: ["decreases", "less glucose", "older", "reduced uptake", "decrease with age", "lower amount"],
      },
      {
        id: "r4",
        name: "Part (d) – Justification",
        points: 1,
        description: "With fewer glucose transporter proteins expressed in older animals' red blood cells, fewer glucose molecules can be transported into the cells via facilitated diffusion, resulting in less glucose inside the cells.",
        keywords: ["fewer transporters", "less transport", "facilitated diffusion", "fewer glucose molecules", "fewer proteins", "cannot enter"],
      },
    ],
  },

  // ── Q4: Wild Oat Invasive Species & Aphids (Short, 4 pts) ───────────────────
  {
    topicSlug: "ecology",
    year: 2024,
    questionNum: 4,
    type: "SHORT" as const,
    difficulty: "EASY" as const,
    totalPoints: 4,
    summary: "Invasive species effects on ecosystem resilience, aphid-plant virus interactions, and biological control with ladybugs.",
    imageUrls: [],
    prompt: `The common wild oat is native to regions of Europe and Asia but is an invasive species in central California grasslands. In California, the common wild oat has almost completely replaced some species of native bunchgrass. Researchers found that aphids, a type of small insect that often carries plant viruses, have a much higher reproductive rate in grasslands that include the common wild oat than in grasslands composed of only native bunchgrass species. Additionally, the viruses carried by the aphids appear to affect only the native bunchgrasses and not the common wild oat. Native bunchgrasses infected by the virus have much higher death rates than do native bunchgrasses that are not infected.

(a) Describe the change in the resilience of an ecosystem when there is a decrease in the number of species.

(b) Explain how the addition of the common wild oat affects the number of native bunchgrass plants that can be supported by the California grasslands ecosystem.

(c) Researchers suggest adding ladybugs, predators of aphids, to the California grasslands. Predict the effect of adding ladybugs on the abundance of the native bunchgrass population.

(d) Justify your prediction in part (c).`,
    rubric: [
      {
        id: "r1",
        name: "Part (a) – Resilience decrease with fewer species",
        points: 1,
        description: "Ecosystem resilience decreases when there is a decrease in the number of species (fewer species = less ability to recover from disturbance).",
        keywords: ["resilience decreases", "decrease", "fewer species", "less resilient", "reduced resilience", "less stable"],
      },
      {
        id: "r2",
        name: "Part (b) – Wild oat reduces native bunchgrass",
        points: 1,
        description: "The wild oat limits resources available to native bunchgrasses through competition, and/or the wild oat enables the aphid population to increase, which increases virus transmission to native bunchgrasses, resulting in higher bunchgrass death rates and a smaller bunchgrass population.",
        keywords: ["competition", "limits resources", "aphid population increases", "virus transmission", "higher death rate", "fewer native bunchgrass", "carrying capacity"],
      },
      {
        id: "r3",
        name: "Part (c) – Ladybug addition prediction",
        points: 1,
        description: "The native bunchgrass population will increase in abundance.",
        keywords: ["increase", "native bunchgrass increases", "abundance increases", "more bunchgrass", "will increase"],
      },
      {
        id: "r4",
        name: "Part (d) – Justification",
        points: 1,
        description: "Adding ladybugs will decrease the number of aphids; fewer aphids means less transmission of plant viruses to native bunchgrasses; with less viral infection, the death rate of native bunchgrasses decreases, allowing the population to increase.",
        keywords: ["fewer aphids", "less virus", "reduced infection", "lower death rate", "ladybugs reduce aphids", "less transmission", "bunchgrass survives"],
      },
    ],
  },

  // ── Q5: Cod Antifreeze Genes & Speciation (Short, 4 pts) ────────────────────
  {
    topicSlug: "natural-selection",
    year: 2024,
    questionNum: 5,
    type: "SHORT" as const,
    difficulty: "MEDIUM" as const,
    totalPoints: 4,
    summary: "Evolution of antifreeze-glycoprotein genes in Gadidae cod family; post-zygotic isolation and phylogenetic analysis.",
    imageUrls: [
      "/frq-images/2024/q5_fig1_cropped.png",
      "/frq-images/2024/q5_fig2_cropped.png",
    ],
    prompt: `Researchers study mechanisms that enable or prevent speciation.

(a) Describe a post-zygotic mechanism that prevents gene flow and thus enables speciation.

New genes can evolve from noncoding regions of DNA. It is not until certain regulatory elements are present in the DNA that a noncoding region becomes a new, functional gene that encodes a protein. These regulatory elements include a promoter, a 5′ untranslated region (UTR) followed by a start codon, and a 3′ UTR following a stop codon (Figure 1).

Figure 1. Basic structure of a functional ag gene.

Researchers studied the evolution of the family of antifreeze-glycoprotein (AG) encoding genes in Gadidae, a family of marine fish known as cods. When present in the fish, these glycoproteins reduce the freezing temperature of the fish. The researchers compared genomic sequences in nine cod species and one non-cod fish species, B. brosme. They recorded the presence or absence of the elements of functional ag genes as well as ag-like sequences that are similar to a functional gene but have undergone mutation and do not contain all the elements required to enable protein production (Figure 2).

Figure 2. Phylogenetic tree showing the evolution of ag genes.

(b) Based on the data in Figure 2, explain how changes to the genome enabled cods to survive and reproduce after a period of freezing temperatures between 10 and 15 million years ago.

(c) Using the template in the space provided for your response, place an "X" on the phylogenetic tree to represent the origin of the functional ag gene.

(d) Based on Figure 2, explain how genetic differences among the species in the Gadidae family determine the habitats in which they can survive.`,
    rubric: [
      {
        id: "r1",
        name: "Part (a) – Post-zygotic isolation mechanism",
        points: 1,
        description: "A post-zygotic mechanism is one that occurs after fertilization; examples include hybrid inviability (hybrid offspring do not survive long enough to reproduce) or hybrid sterility (hybrid offspring cannot successfully reproduce, e.g., mules).",
        keywords: ["post-zygotic", "hybrid inviability", "hybrid sterility", "offspring cannot reproduce", "offspring do not survive", "after fertilization"],
      },
      {
        id: "r2",
        name: "Part (b) – Genome changes enabling survival in freezing temps",
        points: 1,
        description: "Over time, the addition of regulatory elements (promoter, 5′ UTR, 3′ UTR, ag repeat sequences) to noncoding/ag-like sequences led to the emergence of new functional ag genes that encode antifreeze glycoproteins, which reduce the freezing temperature of the fish and allow survival in cold water.",
        keywords: ["regulatory elements", "promoter", "UTR", "functional ag gene", "antifreeze glycoprotein", "freezing temperature", "noncoding", "new gene"],
      },
      {
        id: "r3",
        name: "Part (c) – Origin of functional ag gene on phylogenetic tree",
        points: 1,
        description: "An X is placed on the branch/line leading to the ancestor of the Gadidae species that have functional ag genes (the colored L-shaped ancestral line in Figure 2).",
        keywords: ["X on branch", "ancestral line", "common ancestor", "origin", "functional ag gene", "phylogenetic tree"],
      },
      {
        id: "r4",
        name: "Part (d) – Genetic differences determine habitats",
        points: 1,
        description: "Species with the functional ag gene can produce antifreeze glycoproteins and therefore can survive in colder/freezing water temperatures; species without the functional ag gene lack antifreeze protection and are restricted to warmer water habitats.",
        keywords: ["functional ag gene", "colder water", "antifreeze glycoprotein", "warmer habitats", "without ag gene", "freezing temperatures", "habitat range"],
      },
    ],
  },

  // ── Q6: Codon Translation Rates (Short, 4 pts) ──────────────────────────────
  {
    topicSlug: "gene-expression",
    year: 2024,
    questionNum: 6,
    type: "SHORT" as const,
    difficulty: "MEDIUM" as const,
    totalPoints: 4,
    summary: "Ribosome profiling of codon translation rates, tRNA availability, and codon usage bias in protein production.",
    imageUrls: ["/frq-images/2024/q6_fig1_cropped.png"],
    prompt: `Scientists can quantify the rate of translation as ribosomes move along an mRNA from one codon to the next. Using a procedure called ribosome profiling, the scientists measured how long a ribosome remains stationary at each codon of each mRNA. They determined the average translation rate across all codons is 5.2 amino acids per second but that the average translation rate for specific codons in different mRNA sequences can vary widely. These variations in translation rates are thought to facilitate correct folding of the protein being produced. The rate at which three different codons were translated was measured in 100 different mRNAs. The scientists determined the distribution of rate (number of times each rate was recorded) for each of the three codons: GAC (Figure 1A), AUU (Figure 1B), and UGG (Figure 1C).

Figure 1. The distribution of translation rates for three different codons (A) GAC, (B) AUU, and (C) UGG.

(a) Using the data in Figure 1, graph A, identify the rate (in ms/codon) that was recorded the greatest number of times for the GAC codon.

(b) Using the data in Figure 1, graphs B and C, describe the variation in translation rate of the AUU codon compared with that of the UGG codon.

(c) Scientists hypothesize that tRNA molecules that bind to UGG codons are available in lower abundance than are tRNAs that bind to AUU codons. Support the scientists' hypothesis using the data in Figure 1.

(d) Amino acids can be encoded by multiple codons. In many organisms, certain codons for the same amino acid occur more frequently in an mRNA than do other codons. Based on the data provided, explain why the use of one codon over another for the same amino acid might result in increased levels of protein production from a particular mRNA.`,
    rubric: [
      {
        id: "r1",
        name: "Part (a) – Most frequent GAC translation rate",
        points: 1,
        description: "150 ms/codon was recorded the greatest number of times for the GAC codon.",
        keywords: ["150", "150 ms/codon", "most frequent", "GAC", "greatest number"],
      },
      {
        id: "r2",
        name: "Part (b) – AUU vs. UGG variation",
        points: 1,
        description: "There is greater variation in the translation rate of UGG compared to AUU. UGG ranges from ~50 to ~950 ms/codon, while AUU ranges from ~50 to ~450 ms/codon.",
        keywords: ["greater variation", "UGG more variable", "wider range", "50 to 950", "50 to 450", "AUU narrower", "UGG wider"],
      },
      {
        id: "r3",
        name: "Part (c) – Support low tRNA abundance for UGG",
        points: 1,
        description: "The average/median translation rate of UGG is slower than that of AUU (ribosomes spend longer at UGG codons), and more UGG codons are translated at slower rates. When tRNA is scarce, ribosomes must wait longer for a tRNA to arrive, explaining the slower and more variable translation rates for UGG.",
        keywords: ["slower translation rate", "UGG slower", "ribosomes wait", "tRNA scarce", "lower abundance tRNA", "longer time", "slower rates"],
      },
      {
        id: "r4",
        name: "Part (d) – Codon choice and protein production",
        points: 1,
        description: "Certain codons are translated at faster rates than others (e.g., codons with abundant cognate tRNAs like AUU); mRNAs that use these faster-translated codons will produce protein more rapidly, resulting in higher levels of protein production per unit time.",
        keywords: ["faster translation rate", "abundant tRNA", "more protein", "faster codons", "higher protein production", "codon bias", "codon choice"],
      },
    ],
  },
]

async function main() {
  console.log("Seeding 2024 AP Biology FRQs...")

  for (const frq of frqs2024) {
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
        source: "AP Biology 2024 Official Exam (College Board)",
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
        source: "AP Biology 2024 Official Exam (College Board)",
        isOfficial: true,
      },
    })

    console.log(`  ✓ Seeded FRQ: 2024 Q${frq.questionNum} (${frq.topicSlug}) — ${frq.totalPoints} pts`)
  }

  console.log("Done!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
