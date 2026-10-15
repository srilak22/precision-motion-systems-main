"""Robotics company mining command line entry point."""

import argparse

from config import OUTPUT_DIR
from exporter import export_results
from scraper import run_sources
from sources import SOURCES


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Robotics company web mining")
    actions = parser.add_mutually_exclusive_group(required=True)
    actions.add_argument("--list-sources", action="store_true")
    actions.add_argument("--test", action="store_true")
    actions.add_argument("--run", action="store_true")
    actions.add_argument("--export", action="store_true")
    parser.add_argument("--limit", type=int, default=None, help="Maximum seed websites to process")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if args.limit is not None and args.limit < 1:
        raise SystemExit("--limit must be a positive integer")
    if args.list_sources:
        for index, source in enumerate(SOURCES, start=1):
            print(f"{index:02d}. {source.name} | {source.url} | {source.industry}")
        print(f"Total: {len(SOURCES)} seed websites")
        return
    if args.export:
        print(export_results())
        return
    if args.test:
        run_sources(SOURCES[:2], checkpoint=False, export=False)
        return
    selected_sources = SOURCES[:args.limit] if args.limit else SOURCES
    run_sources(selected_sources, checkpoint=True)
    print(f"Outputs written under {OUTPUT_DIR}")


if __name__ == "__main__":
    main()