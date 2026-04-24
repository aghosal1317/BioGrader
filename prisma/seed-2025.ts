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

const frqs2025 = [
  // ── Q1: ER Protein Transport (Long, 9 pts) ──────────────────────────────────
  {
    topicSlug: "cell-structure",
    year: 2025,
    questionNum: 1,
    type: "LONG" as const,
    difficulty: "HARD" as const,
    totalPoints: 9,
    summary: "ER protein transport mechanisms, siRNA experiments, and translation.",
    imageUrls: [
      "/frq-images/2025/q1_fig1_cropped.png",
      "/frq-images/2025/q1_fig2_cropped.png",
    ],
    prompt: `Most proteins that are secreted from a cell must be transported to the endoplasmic reticulum (ER) either during translation or after translation.

A. Describe the function of ribosomes.

For proteins transported during translation, this process begins in the cytosol and pauses when a specific sequence of amino acids is translated. The translation complex is then transported to the surface of the ER where translation continues. Proteins that are transported after translation are translated entirely in the cytosol and then transported to the ER. In both instances, the translated proteins enter the ER through a protein channel in the membrane of the ER.

Researchers studying the two types of protein transport identified that the ER membrane protein SR is necessary for transport during translation, while the ER membrane protein Sec62 is necessary for transport after translation. To investigate which transport mechanism is used for different proteins, researchers first created small interfering RNAs (siRNAs) that reduce expression of either SR or Sec62. They then treated groups of cells with either the SR siRNA or the Sec62 siRNA and determined the relative amount of SR and Sec62 protein in each group of cells compared with cells treated with a control siRNA (Figure 1).

Figure 1. Average relative amounts of Sec62 and SR proteins in cells treated with control siRNA, Sec62 siRNA, or SR siRNA. Error bars represent ±SE.

B.
i. Identify the dependent variable in the experiments shown in Figure 1.
ii. Justify why the researchers included the control of measuring the relative amounts of both Sec62 and SR proteins in cells that were treated with Sec62 siRNA only (data shown in Figure 1).
iii. Based on Figure 1, describe the effect on the production of SR protein when cells are treated with Sec62 siRNA.

The researchers then measured the amount of each of three different proteins that was transported to the ER in cells treated with Sec62 siRNA or SR siRNA. The researchers calculated the percent transported relative to the cells treated with control siRNA (Figure 2).

Figure 2. Average relative amounts of three proteins that were transported to the ER when treated with control siRNA, Sec62 siRNA, or SR siRNA. Error bars represent ±SE.

C.
i. Identify the independent variable in the researchers' second experiment (data shown in Figure 2).
ii. Based on Figure 2, identify the protein(s) that when treated with Sec62 siRNA showed an increase in percent transport to the ER compared with the control.
iii. Protein 1 is encoded by 234 nucleotides, while protein 2 is encoded by 495 nucleotides. Assuming all nucleotides for both proteins encode amino acids, calculate the difference in the number of amino acids between the two proteins.

D.
i. Researchers claim that protein 1 is the only tested protein that is transported to the ER following its complete translation in the cytosol. Using data from Figure 2, support the researchers' claim.
ii. For any protein that enters the ER, researchers claim that amino acids close to the protein's amino terminus determine how likely the protein is to pass through the protein channel within the ER membrane. Justify the researchers' claim based on your understanding of factors that affect the transport of proteins across membranes.`,
    rubric: [
      {
        id: "r1",
        name: "Part A – Ribosome function",
        points: 1,
        description: "Ribosomes synthesize polypeptides/proteins (perform translation).",
        keywords: ["ribosomes", "translation", "synthesize", "polypeptide", "protein synthesis"],
      },
      {
        id: "r2",
        name: "Part B(i) – Dependent variable",
        points: 1,
        description: "The (relative) amount of protein/protein content is the dependent variable.",
        keywords: ["relative amount", "protein content", "dependent variable", "amount of protein"],
      },
      {
        id: "r3",
        name: "Part B(ii) – Justification of control",
        points: 1,
        description: "The control allowed researchers to determine whether the Sec62 siRNA reduced only Sec62 protein content (and not SR), confirming the siRNA's specificity.",
        keywords: ["specificity", "only Sec62", "not SR", "reduced", "control", "both proteins"],
      },
      {
        id: "r4",
        name: "Part B(iii) – SR protein effect with Sec62 siRNA",
        points: 1,
        description: "SR protein production increased (by ~65%, accept 50–80%) when cells were treated with Sec62 siRNA.",
        keywords: ["increased", "SR protein", "Sec62 siRNA", "higher", "65%"],
      },
      {
        id: "r5",
        name: "Part C(i) – Independent variable",
        points: 1,
        description: "The type of siRNA added to the cells (or the type of protein whose transport was measured).",
        keywords: ["siRNA", "type of siRNA", "independent variable", "treatment"],
      },
      {
        id: "r6",
        name: "Part C(ii) – Proteins with increased transport via Sec62 siRNA",
        points: 1,
        description: "Proteins 2 and/or 3 showed increased percent transport to the ER when treated with Sec62 siRNA compared with the control.",
        keywords: ["protein 2", "protein 3", "increased transport", "Sec62 siRNA"],
      },
      {
        id: "r7",
        name: "Part C(iii) – Amino acid difference calculation",
        points: 1,
        description: "87 amino acids: (495 ÷ 3) − (234 ÷ 3) = 165 − 78 = 87.",
        keywords: ["87", "amino acids", "495/3", "234/3", "165", "78"],
      },
      {
        id: "r8",
        name: "Part D(i) – Supporting claim for protein 1",
        points: 1,
        description: "Only protein 1 showed a reduced percentage of transport when cells were treated with Sec62 siRNA (Sec62 is needed for post-translational transport), supporting that it is transported after complete translation.",
        keywords: ["protein 1", "reduced", "Sec62 siRNA", "only protein 1", "post-translational", "complete translation"],
      },
      {
        id: "r9",
        name: "Part D(ii) – Amino terminus and membrane transport",
        points: 1,
        description: "Amino acids at the amino terminus with similar polarity to (or opposite charge to) the R groups lining the protein channel are more likely to pass through the channel; dissimilar polarity reduces passage likelihood.",
        keywords: ["amino terminus", "polarity", "channel", "hydrophobic", "nonpolar", "charge", "R group", "pass through"],
      },
    ],
  },

  // ── Q2: Moth Pheromones & GPCR Signaling (Long, 9 pts) ─────────────────────
  {
    topicSlug: "cell-communication",
    year: 2025,
    questionNum: 2,
    type: "LONG" as const,
    difficulty: "HARD" as const,
    totalPoints: 9,
    summary: "GPCR signaling pathway, moth pheromone behavior, and graphing experimental data.",
    imageUrls: [
      "/frq-images/2025/q2_fig1_cropped.png",
    ],
    prompt: `Many insects rely on pheromones (chemical signals) that are released by the females to find mating partners. Scientists hypothesize that, in a certain type of moth, the behavior of male moths in response to pheromones is regulated by the extracellular signaling molecule 20E.

A. Many receptors are embedded in the plasma membrane. Describe the polarity of the portion of the receptor that is inside the membrane.

To investigate whether the binding of 20E to its receptor, DopEcR, affects behavior in moths, scientists injected male moths with saline (control solution) or with small interfering RNA molecules (siRNAs) that inhibit the expression of the gene encoding DopEcR. The scientists then exposed the moths to the pheromone and determined the percent of total time observed that the moths engaged in general activity (movement in any direction), and the percent of the general activity time spent in oriented activity (movement toward high pheromone concentration).

Table 1. Average General and Oriented Activity in Male Moths Injected With Saline or siRNA Molecules

| Treatment | General Activity (% of total time, avg ±2SE) | Oriented Activity (% of general activity, avg ±2SE) |
|---|---|---|
| Male moths injected with saline (control) | 95 ± 5 | 60 ± 4 |
| Male moths injected with siRNAs inhibiting DopEcR | 90 ± 8 | 25 ± 6 |

DopEcR is a G protein-coupled receptor. When 20E binds to DopEcR, GTP displaces the GDP bound to the G protein, and a signaling pathway is activated. The scientists hypothesize that this leads to the transcription of genes associated with the oriented activity observed in the male moths (Figure 1).

Figure 1. A simplified model of a signaling pathway activated by the binding of 20E to its receptor, DopEcR.

B.
i. Using the template in the space provided for your response, construct an appropriate type of graph that represents the data in Table 1. Your graph should be appropriately plotted and labeled.
ii. Based on the data in Table 1, determine the type of activity that was affected by inhibiting the expression of the DopEcR receptor.

C.
i. Based on Table 1, identify the treatment group in which the oriented activity was greater than 50% of the general activity.
ii. The scientists studied some moths with a mutation in the gene encoding the G protein. The mutation prevents GTP from displacing the GDP bound to the G protein. Based on Figure 1, predict the effect of this mutation on the oriented activity in male moths exposed to the pheromone.

Expression of the gene encoding DopEcR is low in the male moths during their first few days as adults, when they are sexually immature. Gene expression rapidly increases as the moths reach sexual maturity. The scientists claim that this increase in gene expression increases the likelihood of males finding females with whom to mate.

D.
i. Use evidence from the information provided to support the scientists' claim.
ii. Based on Figure 1, explain how an inhibitor of the DopEcR pathway might serve as an effective chemical to protect crops from moth damage.`,
    rubric: [
      {
        id: "r1",
        name: "Part A – Polarity of receptor inside membrane",
        points: 1,
        description: "The portion of the receptor inside the membrane is nonpolar/hydrophobic (to be compatible with the hydrophobic lipid bilayer interior).",
        keywords: ["nonpolar", "hydrophobic", "inside membrane", "lipid bilayer"],
      },
      {
        id: "r2",
        name: "Part B(i) – Graph type",
        points: 1,
        description: "Data are represented in a bar graph (or modified bar graph).",
        keywords: ["bar graph", "bar chart"],
      },
      {
        id: "r3",
        name: "Part B(i) – Data accuracy",
        points: 1,
        description: "Data and error bars are accurately plotted (saline: 95±5 general, 60±4 oriented; siRNA: 90±8 general, 25±6 oriented).",
        keywords: ["95", "90", "60", "25", "error bars", "±5", "±4", "±8", "±6", "accurately plotted"],
      },
      {
        id: "r4",
        name: "Part B(i) – Graph labels",
        points: 1,
        description: "Graph is appropriately labeled (axes titles, units, legend distinguishing treatment groups).",
        keywords: ["labeled", "axis", "legend", "title", "treatment", "units", "percent"],
      },
      {
        id: "r5",
        name: "Part B(ii) – Activity type affected",
        points: 1,
        description: "Oriented activity was the type affected by inhibiting DopEcR expression (general activity was not significantly different between groups).",
        keywords: ["oriented activity", "affected", "inhibiting DopEcR", "not general"],
      },
      {
        id: "r6",
        name: "Part C(i) – Treatment group with oriented activity > 50%",
        points: 1,
        description: "The control/saline-treated group had oriented activity greater than 50% of general activity (60% ± 4).",
        keywords: ["control", "saline", "60%", "greater than 50%", "control group"],
      },
      {
        id: "r7",
        name: "Part C(ii) – Mutation effect on oriented activity",
        points: 1,
        description: "The moths will show decreased/no oriented activity because without GTP displacing GDP, the G protein remains inactive and the signaling pathway cannot be activated.",
        keywords: ["decreased", "no oriented activity", "G protein inactive", "GDP", "GTP", "signaling pathway blocked"],
      },
      {
        id: "r8",
        name: "Part D(i) – Support scientists' claim",
        points: 1,
        description: "Increased expression of DopEcR at sexual maturity will increase oriented activity (moving toward pheromone source), increasing the likelihood of finding a mate; more receptors available means more sensitivity to 20E/pheromones.",
        keywords: ["increased DopEcR", "oriented activity", "find mate", "more receptors", "sexual maturity", "pheromone sensitivity"],
      },
      {
        id: "r9",
        name: "Part D(ii) – Inhibitor as crop protection",
        points: 1,
        description: "An inhibitor of the DopEcR pathway will reduce oriented activity and therefore decrease mating success, reducing population growth and crop damage.",
        keywords: ["inhibitor", "reduce oriented activity", "decrease mating", "population growth", "crop damage", "less mating"],
      },
    ],
  },

  // ── Q3: Buffelgrass Ecology (Short, 4 pts) ──────────────────────────────────
  {
    topicSlug: "ecology",
    year: 2025,
    questionNum: 3,
    type: "SHORT" as const,
    difficulty: "MEDIUM" as const,
    totalPoints: 4,
    summary: "Invasive species, keystone species, experimental design, and population ecology.",
    imageUrls: [],
    prompt: `Buffelgrass, an invasive grass species in southwestern desert ecosystems, is threatening the saguaro cactus, a keystone species in these ecosystems. Buffelgrass is drought-tolerant and can survive wildfires. However, the dry buffelgrass also acts as fuel for wildfires, causing the fires to be more severe. Older saguaro cacti can survive wildfires; however, many of the young cacti cannot.

Scientists conducted an experiment to determine whether they could control the abundance of the buffelgrass population. The scientists identified several native grass species that, when grown with buffelgrass, might reduce the abundance of buffelgrass. They grew buffelgrass in the presence of several different native grass species in greenhouses, in either nondrought (watered every 3 days) or drought (watered every 9 days) conditions. After twelve weeks, they measured the height and dry weight of the buffelgrass in each treatment group.

A. Describe the effect that removing a keystone species will have on an ecosystem.

B. Identify a control group the scientists should include in their experiment.

C. State the null hypothesis of the experiment in which buffelgrass is grown in the presence of native grass species.

D. Scientists have found that the population growth rates of native grasses are much slower than the population growth rate of buffelgrass following a wildfire. The scientists claim that wildfires will therefore increase the abundance of buffelgrass plants in the ecosystem. Based on the information given, justify the scientists' claim.`,
    rubric: [
      {
        id: "r1",
        name: "Part A – Effect of removing keystone species",
        points: 1,
        description: "Removing a keystone species reduces biodiversity/diversity/resilience of the ecosystem, or will cause the ecosystem to collapse.",
        keywords: ["biodiversity", "diversity", "resilience", "collapse", "ecosystem structure", "keystone"],
      },
      {
        id: "r2",
        name: "Part B – Control group",
        points: 1,
        description: "A control group with only buffelgrass planted (no native grass species) should be included.",
        keywords: ["buffelgrass alone", "no native grass", "only buffelgrass", "control", "no native species"],
      },
      {
        id: "r3",
        name: "Part C – Null hypothesis",
        points: 1,
        description: "There will be no difference in/effect on the abundance, dry weight, or height of buffelgrass when grown with native plants compared to when grown alone.",
        keywords: ["no difference", "no effect", "null hypothesis", "abundance", "dry weight", "height", "native plants"],
      },
      {
        id: "r4",
        name: "Part D – Justification of wildfire increasing buffelgrass",
        points: 1,
        description: "After a wildfire, native grasses recover more slowly than buffelgrass, so buffelgrass will have less competition for resources and will increase in abundance.",
        keywords: ["less competition", "slower recovery", "more resources", "buffelgrass", "wildfire", "competition", "native grasses"],
      },
    ],
  },

  // ── Q4: Isthmus of Panama & Divergent Evolution (Short, 4 pts) ──────────────
  {
    topicSlug: "natural-selection",
    year: 2025,
    questionNum: 4,
    type: "SHORT" as const,
    difficulty: "MEDIUM" as const,
    totalPoints: 4,
    summary: "Allopatric speciation, divergent evolution, and interspecific competition via the Isthmus of Panama.",
    imageUrls: [],
    prompt: `Twenty million years ago the Caribbean Sea and Pacific Ocean were connected, and water flowed freely between the two bodies of water. Many of the same marine species were found in both areas. Over millions of years, the land referred to as the Isthmus of Panama formed, eventually closing off the connection between the Caribbean Sea and Pacific Ocean and creating two separate bodies of water. The ecology of these two marine habitats was dramatically altered by this land formation. The warmer Caribbean water could no longer flow west, so the Pacific water cooled and became more nutrient-rich, while the Caribbean water became warmer.

A. Describe the genetic evidence that evolution is occurring in a population.

B. Explain how the isolation of marine species by the formation of a land barrier can lead to divergent evolution of those species.

The formation of the Isthmus of Panama connected two continents, North America and South America. Many North American land animal species migrated to South America after the formation of the isthmus and occupied similar niches as South American species.

C. Predict the effect the formation of the isthmus had on resource availability for South American species.

D. Justify your prediction in part C.`,
    rubric: [
      {
        id: "r1",
        name: "Part A – Genetic evidence of evolution",
        points: 1,
        description: "There are changes in allele/gene frequencies over time, or heritable changes in phenotypes in the population.",
        keywords: ["allele frequency", "gene frequency", "heritable changes", "phenotype", "change over time"],
      },
      {
        id: "r2",
        name: "Part B – Land barrier leads to divergent evolution",
        points: 1,
        description: "The land barrier results in reproductive isolation/lack of gene flow (allopatric speciation); different environmental conditions/selective pressures select for different alleles/genotypes/phenotypes in each population.",
        keywords: ["reproductive isolation", "gene flow", "allopatric", "selective pressures", "different alleles", "diverge", "separate populations"],
      },
      {
        id: "r3",
        name: "Part C – Prediction on resource availability",
        points: 1,
        description: "Resource availability would have decreased for South American species.",
        keywords: ["decreased", "reduced", "less resources", "fewer resources", "resource availability"],
      },
      {
        id: "r4",
        name: "Part D – Justification of prediction",
        points: 1,
        description: "More species (North American migrants) would now be competing for the same resources, resulting in fewer resources available for each individual South American species.",
        keywords: ["more species", "competing", "same resources", "competition", "interspecific", "North American", "fewer resources"],
      },
    ],
  },

  // ── Q5: Enzyme Metabolic Pathway (Short, 4 pts) ─────────────────────────────
  {
    topicSlug: "cellular-energetics",
    year: 2025,
    questionNum: 5,
    type: "SHORT" as const,
    difficulty: "MEDIUM" as const,
    totalPoints: 4,
    summary: "Enzyme active sites, allosteric feedback inhibition, and pH effects on enzyme function.",
    imageUrls: [
      "/frq-images/2025/q5_fig1_cropped.png",
    ],
    prompt: `Figure 1 shows the reactions of the metabolic pathway used to synthesize amino acid B from amino acid A in cells.

Figure 1. Synthesis of amino acid B from amino acid A

(The pathway shows: Amino Acid A → [Enzyme 1] → Intermediate X → [Enzyme 2] → Intermediate Y → [Enzyme 3] → Amino Acid B. Amino acid B feeds back to inhibit Enzyme 1 via an allosteric site.)

A. Describe a characteristic of an enzyme's active site that allows it to catalyze a specific chemical reaction.

B. Based on Figure 1, explain how the binding of amino acid A to enzyme 1 is regulated by amino acid B.

C. Using the information in Figure 1, identify the product of the reaction catalyzed by enzyme 2: intermediate X, intermediate Y, or amino acid B.

D. Based on Figure 1, explain how a change in pH could affect enzyme 3 in such a way that amino acid B cannot be produced.`,
    rubric: [
      {
        id: "r1",
        name: "Part A – Active site specificity",
        points: 1,
        description: "The active site has a shape/charge complementary to a specific substrate, allowing only that substrate to bind (induced fit positions substrate to make reaction more likely).",
        keywords: ["active site", "shape", "charge", "complementary", "specific substrate", "induced fit", "bind"],
      },
      {
        id: "r2",
        name: "Part B – Allosteric feedback inhibition",
        points: 1,
        description: "Amino acid B inhibits enzyme 1 by binding to an allosteric site, causing a conformational change that prevents amino acid A from binding to the active site (feedback inhibition).",
        keywords: ["amino acid B", "allosteric", "inhibit", "enzyme 1", "conformational change", "prevent binding", "feedback inhibition"],
      },
      {
        id: "r3",
        name: "Part C – Product of enzyme 2",
        points: 1,
        description: "Intermediate Y is the product of the reaction catalyzed by enzyme 2.",
        keywords: ["intermediate Y", "enzyme 2", "product"],
      },
      {
        id: "r4",
        name: "Part D – pH effect on enzyme 3",
        points: 1,
        description: "A change in pH could denature enzyme 3 (alter the shape of its active site by disrupting hydrogen bonds and ionic interactions among R groups), so that intermediate Y/the substrate can no longer bind, preventing production of amino acid B.",
        keywords: ["pH", "denature", "enzyme 3", "active site", "shape change", "substrate cannot bind", "amino acid B", "R group", "hydrogen bond"],
      },
    ],
  },

  // ── Q6: ALD Protein & Meiosis (Short, 4 pts) ────────────────────────────────
  {
    topicSlug: "heredity",
    year: 2025,
    questionNum: 6,
    type: "SHORT" as const,
    difficulty: "HARD" as const,
    totalPoints: 4,
    summary: "ALD protein function in meiosis, analyzing mutation data, and protein functionality vs. quantity.",
    imageUrls: [
      "/frq-images/2025/q6_fig1_cropped.png",
    ],
    prompt: `The ald gene of fruit flies encodes the ALD protein, which is associated with both the centromeres of chromosomes and protein filaments produced during meiosis. In the absence of functional ALD proteins, gamete-producing cells enter anaphase I before homologous chromosomes are correctly aligned. As a result, the gametes produced do not contain the correct numbers of chromosomes.

Scientists generated four mutations in the ald gene: ald1, ald3, ald23, and del, which was a deletion of the gene. To study the role of the ALD protein in meiosis, scientists used gamete-forming metaphase cells from groups of flies with different ald genotypes. Some of the flies were homozygous for the wild-type allele of ald: WT/WT. Other flies were heterozygous for different ald alleles: WT/del; ald1/del; ald3/ald23; ald23/del. The scientists measured the percent of metaphase cells that contained ALD-associated filaments (Figure 1A) and the amount of ALD protein produced by each of the cell types (Figure 1B).

Figure 1. (A) The average percent of gamete-forming metaphase cells that contained filaments associated with ALD and (B) the amount of ALD protein produced by each cell type. A thicker band indicates a greater amount of ALD protein.

A. Based on Figure 1A, identify the fly genotype in which the average percent of metaphase cells with ALD-associated filaments is close to 12%.

B. Based on Figure 1B, describe the difference in ALD protein production between gamete-forming metaphase cells of flies with the genotype ald3/ald23 and flies with the genotype ald23/del.

C. Scientists hypothesize that gamete-forming metaphase cells can produce a normal amount of ALD-associated filaments even when they produce about half as much ALD protein as the wild-type cells produce. Use the data in Figures 1A and 1B to support the scientists' hypothesis.

D. For gamete-forming metaphase cells of the WT/del and ald1/del flies, explain why the phenotypes observed in Figure 1A differ even though the amount of ALD protein produced (Figure 1B) does not.`,
    rubric: [
      {
        id: "r1",
        name: "Part A – Genotype with ~12% ALD filaments",
        points: 1,
        description: "ald1/del is the genotype in which the average percent of metaphase cells with ALD-associated filaments is close to 12%.",
        keywords: ["ald1/del", "12%", "genotype", "ALD filaments"],
      },
      {
        id: "r2",
        name: "Part B – ALD protein production difference",
        points: 1,
        description: "More ALD protein is produced by ald3/ald23 cells than by ald23/del cells. The ald23/del cells produce no ALD protein (band absent), while ald3/ald23 cells do produce ALD protein.",
        keywords: ["more ALD", "ald3/ald23", "ald23/del", "no protein", "less protein", "absent", "thicker band"],
      },
      {
        id: "r3",
        name: "Part C – Support half-protein hypothesis",
        points: 1,
        description: "WT/del cells produce about half as much ALD protein as WT/WT cells (one functional allele vs. two) yet show a similar (normal) percentage of metaphase cells with ALD-associated filaments, supporting the hypothesis.",
        keywords: ["WT/del", "half ALD protein", "normal filaments", "same percentage", "WT/WT", "similar", "supports hypothesis"],
      },
      {
        id: "r4",
        name: "Part D – WT/del vs ald1/del phenotype difference",
        points: 1,
        description: "Both produce similar amounts of ALD protein, but only WT/del produces functional ALD protein (from the WT allele). The ald1 allele produces non-functional/altered ALD protein that cannot generate normal ALD-associated filaments, resulting in a different (reduced) phenotype.",
        keywords: ["functional", "WT allele", "ald1", "non-functional", "altered protein", "cannot generate filaments", "functional protein", "different phenotype"],
      },
    ],
  },
]

async function main() {
  console.log("Seeding 2025 AP Biology FRQs...")

  for (const frq of frqs2025) {
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
        source: "AP Biology 2025 Official Exam (College Board)",
        isOfficial: true,
      },
    })

    console.log(`  ✓ Seeded FRQ: 2025 Q${frq.questionNum} (${frq.topicSlug}) — ${frq.totalPoints} pts`)
  }

  console.log("Done!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
