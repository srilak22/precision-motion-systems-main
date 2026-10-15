# Company Data Extraction Pipeline

This project is a starter skeleton for gathering publicly listed company information from public websites without bypassing access restrictions or violating website terms. The code is intentionally modular so it can be extended with your own source discovery, extraction, validation, and output logic.

## Project structure

- `main.py` – entry point for the pipeline
- `config.py` – base settings and output paths
- `requirements.txt` – Python dependencies
- `scraper/` – discovery, scraping, extraction, and validation modules
- `output/raw/` – raw scraped and extracted candidate data
- `output/verified/` – cleaned, validated companies
- `output/by_industry/` – records grouped by industry
- `logs/` – runtime logs or diagnostics

## Windows setup

From the project root:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

## Run the project

```powershell
python main.py --industry "industrial automation" --location "United States" --target-count 25
```

Optional source file:

```powershell
python main.py --industry "precision motion" --location "Germany" --target-count 15 --source-file companies.csv
```

## Important rules

- Only use public, permitted sources.
- Do not bypass CAPTCHAs, logins, anti-bot protections, or website terms.
- Do not invent missing data.
- If a company cannot be verified, leave it out instead of making assumptions.
- Respect robots.txt, rate limits, and robots exclusion directives.
- Add graceful error handling and skip failed sources.

## Data quality and validation

The project validates records by checking:

- required website URL
- domain format
- similarity checks for duplicates
- business metadata presence where available
- known invalid or blank values

These checks are intentionally conservative so that the output favors correctness over inflated counts.

## Next steps

1. Replace the discovery logic with real public source queries or CSV input.
2. Add more robust parsing of company HTML using a real extraction strategy.
3. Add a logging system and structured output files.
4. Add optional CSV export and deduplication across industries.

## Notes

This is an initial scaffold. It is designed for extension and should be reviewed carefully before running against production or high-volume public sources.
