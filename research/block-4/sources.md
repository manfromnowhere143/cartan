# Physical observation sources

Reviewed 16 November 2026. This extends the earlier ledgers. It corrects an access
gap rather than establishing a vendor defect or a CARTAN capability. Source PDFs
and rendered pages remain outside Git; the repository retains citations, hashes,+reading scope and original analysis. No source publication is relicensed here.

## S22. HOTDOCK design definition

[MOSAR-WP3-D3.7-SA 1.1.0](https://www.h2020-mosar.eu/wp-content/uploads/2021/08/MOSAR-WP3-D3.7-SA_1.1.0-HOTDOCK-Design-Definition-File.pdf),
25 August 2020. Read revision record and sections 4.1.4, 4.2, 4.6 through 4.8;
inspected printed pages 26 and 37 visually. SHA-256
`6512139427e740501c02cd3c7e2c237b67cf201cb6171e19603163fb42a9560d`,
5,330,731 bytes.

The mechanism uses four locking pins, a barrel cam and separate connector motion.
Proximity/orientation sensing differs from cam-position sensing. Voltage/current
sensing is on the relay's connector side. The later housekeeping groups differ
from the preliminary packet list. These are documented relationships, not current
calibration or fault guarantees. The source's misalignment dimensions disagree
within one paragraph; its command table repeats a code. Neither is resolved by
guessing. Reported mechanical capacities are simulation estimates. No operating
limit or binary decoder is derived from them.

## S23. HOTDOCK manual and demonstration procedures

[User manual D2.7 1.0.0](https://www.h2020-mosar.eu/wp-content/uploads/2020/06/MOSAR-WP2-D2.7-SA_1.0.0-HOTDOCK-User-Manual-.pdf),
20 December 2019. Read cover, scope, contents and version record; it covers an
early implementation, not a current operational ICD. Download SHA-256
`9a9c929b7dff78f0fe9595a5e2f90bcc12321b2e63e94277152239c72938fe17`,
2,080,226 bytes. The later D3.7 is the primary design reference for this block.

[Demonstration procedures D3.5 1.1.0](https://www.h2020-mosar.eu/wp-content/uploads/2021/08/MOSAR-WP3-D3.5-DLR_1.1.0-Demonstration-Procedures.pdf),
5 August 2020. Read the B-HOTDOCK component procedures CT-B-2 through CT-B-7,
printed pages 15–17, through the public PDF. The planned checks cover connection,
power switching/protection, symmetry, guidance and mechanical loading. A procedure
is not a completed test report. Baselines must account for these existing
capabilities. These documents belong to the same MOSAR evidence family as S17/S18.

## S24. Direct mechanism indication

[NASA-STD-5017B](https://standards.nasa.gov/sites/default/files/standards/NASA/B/2022-12-06-NASA-STD-5017B-Approved.pdf),
6 December 2022. The official catalogue lists revision B as active on this review
date. Read scope and section 4.7, DDMR 26, printed page 30. Its guidance distinguishes
indication of the function of interest from a drivetrain measurement that can be
decoupled by structural failure, backlash or flexibility. This supports reviewing
the entire indication path. It does not show such a failure in HOTDOCK. This is
design guidance for CARTAN, not an adopted compliance claim. SHA-256
`9fc0210ae0ecc656f8ceadf7b6a5243b3760db0b805e55b3b3e6d1a634866ac4`,
1,264,015 bytes.

## S25. Measurement models

[JCGM GUM-6:2020](https://www.bipm.org/documents/20126/2071204/JCGM_GUM_6_2020.pdf).
Read sections 5.3–5.9, 10.5, 11.4.1–11.4.3 and 11.10.1–11.10.4. Define the
measurand and validity domain, account for influential/shared effects, and
distinguish calibration response from its use in inference. Fit quality alone
does not establish adequacy. SHA-256
`5abfd9c6791c41857c46d84807ec51b189e4b4068f4688936cd6f495c27f8e93`,
2,302,463 bytes.

[JCGM 200:2012](https://www.bipm.org/documents/20126/2071204/JCGM_200_2012.pdf),
definition 2.36, printed pages 27–28, specifies probabilistic coverage. CARTAN's
universal checks require declared bounds; a coverage interval does not become a
guaranteed envelope by renaming it. The earlier 2008 HTML definition was checked
against this official 2012 document.

[JCGM 100:2008 Amendment 1:2026](https://www.bipm.org/documents/20126/2071204/JCGM_100_Amd1_2026.pdf)
was verified in the current BIPM catalogue and its five-page document read. It
addresses significant nonlinearity in uncertainty propagation. The present
verification uses exact rational interval inversion, not a first-order Gaussian
approximation. No probability model, Monte Carlo coverage or metrology compliance
has been validated on CARTAN hardware.

## Coverage and missing evidence

This is a targeted review, not an exhaustive state-of-the-art survey. The 2026
diagnosis methods reviewed in block 2 remain relevant; their assumptions do not
supply missing calibration. No current unit, firmware image, complete circuit,
fault-injection report, calibrated trace or mission-owner limit has been recovered.
Complete original Gemini material remains absent. Sensor position is now better
documented; physical validity remains an open engineering question.
