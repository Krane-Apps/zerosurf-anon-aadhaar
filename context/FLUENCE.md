### Hackathon Details
About
Fluence is a DePIN enabling a cloudless compute platform that provides a resilient, open and low-cost alternative to traditional cloud computing. The platform aggregates CPU resources from enterprise-grade data centers around the world in a global, decentralizde, resilient and cost-effective DePIN platform, allowing users to go cloudless and avoid vendor lock-in and subjective deplatforming.
Prizes
🧠 Best Use of Fluence Virtual Servers ⸺ $5,000
🥇
1st place
$2,500
🥈
2nd place
$1,500
🥉
3rd place
$1,000
A total of $5,000 will be awarded to the most impactful use of Fluence Virtual Servers.
🎯 Goal
Demonstrate a working project using CPU-only VMs from Fluence.
Expectations
> Efficient AI application deployed on Fluence VMs.
> Examples: small/quantized models, inference APIs, agentic LLM backends.
> Ideally, build toward CPU-only compatibility, no GPUs required.
Qualification Requirements
Qualification Requirements
1. Private GitHub Repo
> Keep your repository private until submission.
> Add @justprosh as collaborator before the deadline.
2. Comprehensive Documentation
Include a `README.md with:
> What it does: Project purpose and overview.
> How to set it up: Full setup instructions.
> How to run it: Runtime guidance and usage steps.
> Examples: Demo inputs/outputs, screenshots, or API calls.
3. Deployment & Access
You must:
> Deploy your project on Fluence Virtual Servers
> Provide one of the following:
- A public endpoint + usage instructions + VM id or
- A Terraform or Ansible script to launch your environment on a Fluence VM
4. Licensing
Include an open-source license (e.g., MIT or Apache 2.0).

Links and Resources
Docs
https://fluence.dev/docs/build/overview
↗
Fluence Console
https://console.fluence.network/auth/sign-in
↗
Get approval and 20$ credits
https://fluence.chat/console-credits
↗

FVM CLI (Fluence VM CLI)
A command-line tool for managing Fluence VMs. FVM CLI provides a convenient interface to the Fluence API, allowing you to create, manage and monitor virtual machines in the Fluence network.

API Documentation
This CLI interacts with the Fluence API v3:

API Swagger UI: https://api.fluence.dev/swagger-ui/
Official Documentation: https://fluence.dev/docs/build/api/overview
Using from the GitHub Repository
# Clone the repository
git clone git@github.com:boneyard93501/api-wrapper.git
cd fluence-cli

# Set up environment
cp env.example .env
# Edit .env with your credentials
nano .env

# Install dependencies with uv
uv pip install -e .

# Run the CLI
fvm-cli --help
Configuration
The CLI uses two configuration files:

1. Environment File (.env) - For Secrets Only
Create a .env file with your API key, which you need to create on the console, and SSH key:

# Copy the template
cp .env.example .env

# Edit with your credentials
nano .env
Your .env file should contain ONLY secrets:

# API Key from https://console.fluence.network/settings/api-keys
FLUENCE_API_KEY=your_api_key_here

# SSH Public Key
SSH_PUBLIC_KEY=ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... user@example.com
2. Configuration File (config.yaml) - For Settings
Create/edit a config.yaml file for all other settings:

# Create default config
fvm-cli config init

# Edit as needed
nano config.yaml
The config.yaml contains all non-secret configuration:

# API Configuration
api:
  url: https://api.fluence.dev

# Default VM Configuration  
vm:
  cpu_count: 2
  memory_gb: 4
  storage_gb: 25
  region: US
  name_prefix: fvm-

# Hardware Preferences
hardware:
  cpu_manufacturer: AMD
  cpu_architecture: Zen

# Network Configuration
network:
  open_ports:
    - port: 22
      protocol: tcp
    - port: 80
      protocol: tcp
The CLI looks for config.yaml in:

Current directory
~/.config/fvm-cli/config.yaml
~/.fvm-cli/config.yaml
You can also set FVM_CONFIG_PATH environment variable to specify a custom location.

Global Options
All commands support the following global options:

--format, -f [table|json|compact]: Output format (defaults to table)
table: Formatted output with rich formatting
json: Raw JSON output for scripts and automation
compact: Minimal output for quick viewing
--debug: Show API requests and responses for troubleshooting
Commands
VM Commands
# List active VMs (default)
fvm-cli vm list

# List ALL VMs including terminated ones
fvm-cli vm list --all

# Show full VM IDs without truncation
fvm-cli vm list --full-id

# Filter by status
fvm-cli vm list --status terminated

# Get details for a specific VM
fvm-cli vm get <vm_id>

# List available OS images
fvm-cli vm images

# Create a new VM
fvm-cli vm create [name] --cpu 2 --memory 4 [--wait] [--image <slug>]

# Create a VM with custom configuration file
fvm-cli vm create --config config.toml

# Estimate VM cost without creating
fvm-cli vm estimate --cpu 2 --memory 4 [--region US]

# Update VM (name and/or ports)
fvm-cli vm update <vm_id> --name new-name --add-port 8080/tcp --remove-port 443/tcp

# Delete a VM
fvm-cli vm delete <vm_id> [--force]
Note: The API only supports updating VM name and open ports. CPU/memory scaling is not available.

Marketplace Commands
# List available countries
fvm-cli market countries

# List available basic configurations
fvm-cli market configurations

# Get pricing for a VM configuration
fvm-cli market pricing --cpu 2 --memory 4 [--region US]

# List available hardware options
fvm-cli market hardware

# Search marketplace offers
fvm-cli market offers [--cpu 2] [--memory 4] [--region US] [--max-price 5.00]
Configuration Commands
# Show current configuration
fvm-cli config show

# Initialize default configuration
fvm-cli config init

# Create .env template
fvm-cli config env
Using Format Options
You can use global format options with any command:

# JSON output for scripting
fvm-cli --format json vm list

# Compact output for quick viewing
fvm-cli -f compact vm list

# Debug mode with JSON output
fvm-cli --debug --format json vm create test-vm --cpu 2 --memory 4
Using Configuration Files for VM Creation
Create a JSON configuration file matching the API schema:

{
  "constraints": {
    "basicConfiguration": "cpu-2-ram-4gb-storage-25gb",
    "datacenter": {
      "countries": ["US"]
    },
    "maxTotalPricePerEpochUsd": "5.00"
  },
  "instances": 1,
  "vmConfiguration": {
    "name": "my-fluence-vm",
    "hostname": "my-hostname",
    "osImage": "https://cloud-images.ubuntu.com/releases/22.04/release/ubuntu-22.04-server-cloudimg-amd64.img",
    "sshKeys": ["ssh-ed25519 AAAAC3NzaC1... user@example.com"],
    "openPorts": [
      {"port": 22, "protocol": "tcp"},
      {"port": 80, "protocol": "tcp"},
      {"port": 443, "protocol": "tcp"}
    ]
  }
}
Then create the VM with:

fvm-cli vm create --config config.json
OS Image Selection
Use the vm images command to see available OS images:

# List available images
fvm-cli vm images

# Create VM with specific image
fvm-cli vm create --image ubuntu-22-04-x64

# Create VM with custom image URL
fvm-cli vm create --image https://example.com/custom-image.qcow2
VM Status Values
The Fluence API uses the following VM status values:

Launching - VM is being created
Active - VM is running and accessible
SmallBalance - Low account balance warning
InsufficientFunds - Account has insufficient funds
Terminated - VM has been terminated
Stopped - VM is stopped
Running the Smoke Test
The CLI includes a comprehensive smoke test that verifies all functionality:

# Run with default settings
uv run tests/smoke_test.py

# Run with debug mode to see API requests
uv run tests/smoke_test.py --debug

# Specify custom resources
uv run tests/smoke_test.py --cpu 4 --memory 8 --country US

# Set a maximum price per day
uv run tests/smoke_test.py --max-price 3.50

# Skip cleanup to leave the VM running
uv run tests/smoke_test.py --no-cleanup
Available smoke test options:

--cpu CPU               Number of CPU cores (default: 2)
--memory MEMORY         Memory in GB (default: 4)
--storage STORAGE       Storage in GB (default: 25)
--country COUNTRY       Country code for datacenter location (e.g., US, DE, BE)
--max-price MAX_PRICE   Maximum price per day in USD
--wait                  Wait for VM to be ready (default: True)
--timeout TIMEOUT       Maximum time to wait in seconds (default: 300)
--poll-interval POLL    Time between polls in seconds (default: 10)
--no-cleanup            Don't clean up resources after test
--env-file ENV_FILE     Path to specific .env file
--debug                 Enable debug output
Environment Variables
The CLI uses the following environment variables for secrets only:

Variable	Description	Required
FLUENCE_API_KEY	API key for authentication	Yes
SSH_PUBLIC_KEY	SSH public key for VM access	Yes
FVM_CONFIG_PATH	Custom path to config.yaml	No
DOTENV_PATH	Custom path to .env file	No
Error Handling
The CLI provides detailed error messages for common issues:

401 Unauthorized: Check your API key
403 Forbidden: Your API key lacks required permissions
404 Not Found: Resource doesn't exist
422 Unprocessable Entity: Invalid request data
500 Internal Server Error: Server-side issue
Use --debug flag to see full API requests and responses for troubleshooting.

About
Simple wrapper for Fluence API.

api.fluence.dev/swagger-ui/
Resources
 Readme
 Activity
Stars
 0 stars
Watchers
 1 watching
Forks
 0 forks
Report repository
Releases
No releases published
Packages
No packages published
Languages
Python
100.0%
Footer
© 2025 GitHub, Inc.
Footer navigation
Terms

Overview
Fluence Console is the convenient way to rent and manage resources from the decentralized Fluence compute marketplace. It is a web-based application that allows you to control the complete lifecycle of your resources and services, including your payments and billing.

Fluence Console UI Access
info
Access to Fluence Console is currently only available to participants of the Alpha VM testing program.

Access the Fluence Console: console.fluence.network

API Access
In addition to the web interface, an API is available to programmatically:

Search for available compute resources on the marketplace
Deploy virtual machines with custom configurations
Manage active deployments
The API is ideal for automation, integration with your existing workflows, or building custom tools on top of the Fluence platform.

Learn more about using the API in our API documentation.

Introduction to the Fluence API
The Fluence API provides programmatic access to the decentralized Fluence compute marketplace. With API you can find, rent, and manage compute resources without using the web interface. This document will help you understand how to integrate Fluence's decentralized compute capabilities into your applications and workflows.

info
All API endpoints are available at:

https://api.fluence.dev/

API functionality
The API enables you to:

Search the marketplace - Find compute resources matching specific requirements for CPU, memory, storage, location, and budget
Deploy virtual machines - Create and configure VMs with your choice of operating system and network settings
Manage deployments - View active VMs, modify their configuration, and remove them when no longer needed
Manage SSH keys - View, add, and remove your SSH public keys
API requests
Authentication
All Fluence API endpoints require an API key sent as a Bearer token in the Authorization header.
You can create and manage your keys in the Fluence Console settings guide. If you omit or supply an invalid key, you’ll get a 403 code error.

Request and response format
The Fluence API accepts and returns data in JSON format. When making POST requests, set the Content-Type header to application/json.

Example request
curl -i -X POST https://api.fluence.dev/marketplace/offers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -d '{
    "basicConfiguration": "cpu-4-ram-8gb-storage-25gb"
  }'

Response HTTP statuses
Along with the HTTP methods that the API responds to, it will also return standard HTTP statuses, including error codes.

Success: If the status returned is in the 200 range, it indicates that the request was fulfilled successfully and that no error was encountered.
Error: In the event of a problem, the status will contain the error code:
Client errors: Return codes in the 400 range typically indicate that there was an issue with the request that was sent. For example, this could mean missing or invalid API key, that the object you are requesting does not exist, or that your request is malformed.
Server errors: If you receive a status in the 500 range, this generally indicates a server-side problem. This means that we are having an issue on our end and cannot fulfill your request currently.
Error response body: All 4xx/5xx responses return JSON with an error field with message providing additional information about the error.
Example error response
    HTTP/1.1 403 Forbidden
    {
      "error": "Auth failed. No such API Key",
    }

Common API endpoints
The API is organized around these main resource areas:

Endpoint	Description
/marketplace/*	Endpoints for searching and discovering available compute offerings
/vms/*	Endpoints for deploying and managing virtual machines
/ssh_keys	Endpoints for managing SSH keys
API documentation resources
Swagger UI
The Fluence API also provides an Swagger UI that allows you to explore and try the API endpoints directly in your browser: https://api.fluence.dev/

API Reference
The Fluence API also provides an API Reference that provides more technical details on how to use the API: https://api.fluence.dev/docs

SSH keys and access to VMs
To access your VMs, you need to have at least one SSH key registered. Please ensure you have at least one SSH key registered in your account before creating a VM. You can do it either via the Account settings in Fluence Console or using the API endpoints described in the Manage SSH keys guide.

Next steps
Now that you are familiar with the basics of the Fluence API, you can explore the following guides to learn more:

Find compute resources on the Fluence marketplace - Learn how to search for and compare compute offerings that match your requirements
Deploy virtual machines on the Fluence marketplace - Learn how to deploy and configure VMs
Manage your virtual machines on Fluence - Learn how to view, monitor, and delete your VMs