# Database Initialization Scripts

SQL scripts in this directory are automatically executed when the PostgreSQL container is first initialized.

## Usage

- Scripts are executed in alphabetical order
- Use numbered prefixes (01-, 02-, etc.) to control execution order
- Place schema definitions in early scripts
- Place seed data in later scripts

## Example

- `01-init.sql` - Create extensions and initial schema
- `02-seed.sql` - Insert initial data
- `03-indexes.sql` - Create indexes

## Notes

- These scripts only run on first container creation
- To re-run, you must remove the postgres volume: `make clean` or `podman-compose down -v`
