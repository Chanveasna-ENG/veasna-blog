---
# --- Universal Fields (Applied to ALL types) ---

# The title of your post (Max 100 characters)
title: "How to get Oracle E2.Micro Instance: Always Free Tier Guide"

# A comprehensive description of your post. It must be at least 20 characters long for SEO purposes.
description: "Learn how to claim your Oracle Cloud Always Free instance. Includes a Terraform automation script to bypass 'Out of Capacity' errors and secure your free VPS."

# Creation Date
createdAt: 2026-04-07

# Optional: Last Modified Date
lastModifiedAt: 2026-04-08

# Version of the post
version: "1.0.0"

# Author of the post
author: "Chanveasna ENG"

# Tags for categorization
tags: ["Oracle Cloud", "OCI", "VPS", "Automation", "Terraform", "DevOps"]

# Set to true to hide this post from production builds (Useful for WIP)
draft: false

# --- Images ---

# Cover Image: place your image in the same folder as this file (e.g. `cover.png`) and uncomment the line below.
coverImage: "./cover.png"
coverAlt: "Oracle Cloud dashboard showing Always Free instance status"


# --- The Discriminator ---

# Category must exactly be one of: 'blog', 'project', 'participation', 'learning', 'random'
category: "blog"

---

## Introduction

In this guide, I will walk you through provisioning an Always Free VPS instance on Oracle Cloud Infrastructure (OCI). While the setup involves navigating multiple dashboard screens, the core hurdle most developers encounter is the common `Out of Capacity` error during creation.

Because Oracle allocates a finite pool of Always Free compute per region, high-demand data centers frequently exhaust their unreserved capacity. Below, you will find both the end-to-end dashboard setup and an automated Terraform polling script to secure an instance the moment compute becomes available.

You can jump directly to the automation script using the table of contents.

## Get Started With Creating Account

Visit [www.oracle.com/cloud/](https://www.oracle.com/cloud/) to begin.

1. Click `Try OCI for free`.

![Oracle Cloud](images/image57.png)

Review the Always Free services available, then proceed to account registration.

2. Click `Start for free`.

![Free Tier](images/image23.png)

3. Enter your account information and country location.

![Basic Info Form](images/image25.png)

4. Create a secure password following OCI complexity rules.

![Password and Rules](images/image16.png)

5. Choose a unique cloud account name.

**Important:** You can only provision Always Free instances in your assigned Home Region. This selection cannot be changed later. Choose a region close to your primary location with known Always Free capacity.

![Picking Home Region Screen](images/image8.png)

6. Check your inbox and click `Verify Email`.

![Confirm Email](images/image15.png)

7. Complete the required address and contact fields.

![Address and Location](images/image41.png)

8. Add a payment method for identity verification.

**Note:** Oracle requires a valid debit or credit card (prepaid cards are not accepted) for identity verification. No charges are billed for Always Free tier usage.

![Add Payment Method to Verify](images/image48.png)

9. Enter your billing details to finalize card verification.

![Add Payment Method Page](images/image49.png)

10. Accept the terms of service and click `Complete Sign-Up`.

![Agree to Terms and Create Account](images/image50.png)

11. Oracle will provision your tenancy and send a confirmation email once ready.

![Wait Page](images/image34.png)

![Wait Page 2](images/image20.png)

12. Once your tenancy is active, log into the OCI Console.

![Email Account Creation Completed](images/image19.png)

13. Configure Two-Factor Authentication (2FA) to secure your account.

![2-factor-auth](images/image43.png)

14. **Tip:** You can use any TOTP app (Google Authenticator, Bitwarden, 1Password) by selecting "Another Authentication App" instead of the proprietary Oracle Mobile Authenticator.

![2-factor-auth-setup](images/image6.png)

15. You will now be redirected to the OCI Console dashboard.

![We are in](images/image31.png)

## Create Instance

### Start Creating VM

16. In the dashboard, click `Create a VM instance` under Build & Compute.

![Dashboard's View](images/image11.png)

17. Name your instance and select your availability domain.

![Name Instance](images/image17.png)

18. Under the Image section, click `Change image`.

![OS Image](images/image55.png)

19. Select your preferred Linux distribution (e.g., Ubuntu).

![OS Image Selection](images/image39.png)

20. Select your version (e.g., `24.04 Minimal` for a lean installation).

![OS Version Selection](images/image32.png)

21. Click `Change Shape` to configure instance hardware.

![Server Spec](images/image37.png)

22. Under Shape series, select Virtual Machine.

![VM and Special Instance?](images/image26.png)

23. In the shape table, select a shape tagged **Always Free Eligible** (1 OCPU corresponds to 1 CPU core on AMD/Intel shapes).

![Free Tier Available](images/image53.png)

24. Note: Ampere ARM shapes may require a standard (non-minimal) OS image depending on regional availability.

![No Ampere Instance :(](images/image4.png)

25. Confirm your shape selection.

![Instance Shape](images/image36.png)

26. Shielded Instance options provide firmware-level verification. For standard development workloads, you can leave default settings.

![Security](images/image14.png)

27. If your tenancy does not automatically assign a Virtual Cloud Network (VCN), create one using the VCN Wizard.

![Create New VCN?!](images/image27.png)

![Subnet](images/image24.png)

![Public Subnet](images/image45.png)

28. Ensure public IPv4 address assignment is enabled so your instance can connect to the internet.

![No IPv4?](images/image1.png)

### Creating VCN

29. In a separate browser tab, navigate to `Networking > Virtual Cloud Networks`.

![Network Oracle Services Listing Page](images/image21.png)

30. Click `Create VCN Wizard`—the fastest way to generate subnets, gateways, and route tables automatically.

![Networking Overview](images/image42.png)

31. Enter a VCN name and leave default CIDR blocks.

![Naming VCN](images/image33.png)

![VCN Configuration CIDR...](images/image30.png)

32. Verify that public and private subnets use distinct CIDR blocks.

![Public and Private Subnet CIDR](images/image2.png)

33. Review configuration and click `Create`.

![Summary Page before Creation](images/image54.png)

34. Once provisioning completes, close the VCN wizard tab.

![VCN Creating](images/image29.png)

![VCN Listing Page](images/image12.png)

### Back to Instance Creation Page

35. Return to the instance creation tab and select your newly created VCN (`my-primary-vcn`).

![Configure VCN](images/image35.png)

36. Verify that a public IPv4 address is assigned to the instance.

![IPv4 on Public Subnet](images/image9.png)

![IPv4 Assignment](images/image28.png)

37. Configure your SSH keys. You can paste an existing public key (`.pub`) or choose `Generate a key pair for me`. Be sure to download the private key immediately.

![SSH Key setup.](images/image46.png)

38. Review boot volume defaults and click `Next`.

![Boot Volume](images/image22.png)

39. On the final review page, click `Create`.

![Summary Page for Instance](images/image51.png)

40. If regional capacity is constrained, OCI will return an "Out of capacity" error.

![API request error, OUT OF CAPACITY](images/image10.png)

## Workaround for the Out of Capacity Problem (Linux)

If you hit the "Out of capacity" error, you do not need to manually check the dashboard every day. We can automate resource provisioning using Terraform and a simple loop script that retries until capacity opens up.

41. On the review page, click **Save as stack** to export your configuration. In the stack details view, click **Download Terraform configuration** to save the `.zip` archive to your machine.

![Stack Job Page](images/image52.png)

42. Extract the downloaded configuration on your machine or server:

```bash
mkdir ~/oracle-instance-grabber
cd oracle-instance-grabber
unzip ~/Downloads/<Your_Terraform_Config>.zip
sudo apt install tmux  # Used for running background processes
```

![List files and Install Tmux](images/image38.png)

43. Install Terraform following the official [HashiCorp Installation Guide](https://developer.hashicorp.com/terraform/install):

![Hashicorp Developer Website](image.png)

![Installation Script](image-1.png)

![Install from Terminal](images/image44.png)

44. Create an automated retry script:

```bash
nano grab_oracle.sh
```

Paste the following script:

```bash
#!/bin/bash

while true; do
  echo "Attempting to create instance: $(date)"

  # Run terraform apply
  # -auto-approve skips the [yes/no] prompt
  terraform apply -auto-approve

  # Check if it succeeded (Exit code 0 means success)
  if [ $? -eq 0 ]; then
    echo "SUCCESS! Server created at $(date)"
    exit 0
  fi

  echo "Failed (Out of capacity). Sleeping for 60 seconds..."
  sleep 60
done
```

![grab_oracle.sh](images/image3.png)

45. Update `main.tf` with your OCI API credentials:

![main.tf provider](image-2.png)

```terraform
provider "oci" {
  tenancy_ocid     = "ocid1.tenancy.oc1.."
  fingerprint      = ""
  user_ocid        = "ocid1.user.oc1.."
  region           = "<your region>"
  private_key_path = "/home/<your username>/.oci/key.pem"
}
```

### Finding Credentials to Run Terraform

46. Find your Tenancy OCID under **Profile > Tenancy**:

![Account info in Oracle](image-3.png)

![Account Tenancy Detail](image-4.png)

47. Find your User OCID under **Profile > User Settings**:

![Account info in Oracle](image-3.png)

![User Setting](image-5.png)

48. Under **API Keys**, click **Add API Key**:

![Detail Tabs](image-6.png)

![Add API Key Page](image-7.png)

49. Download your generated private key, click **Add**, and copy the configuration snippet.

![Creating Tokens and Key](image-8.png)

### Running the Script

50. Move your private key to your `.oci` directory and restrict file permissions:

```bash
mkdir -p ~/.oci
mv ~/Downloads/<your-key-file>.pem ~/.oci/key.pem
chmod 400 ~/.oci/key.pem
```

51. Initialize Terraform in your project directory:

```bash
terraform init
```

![Listing file and start tmux session](images/image5.png)

52. Launch the script inside a persistent `tmux` session:

```bash
tmux new -s oracle-grabber
chmod +x grab_oracle.sh
./grab_oracle.sh
```

![Start Running!!!](images/image7.png)

53. The script will continue retrying until an instance successfully provisions. It polls every 60 seconds to avoid rate limits or API abuse flags from Oracle. As soon as another tenant decommissions a VM or regional capacity frees up, the script executes `terraform apply` and claims the instance.

To exit the tmux session without terminating the background script, press `Ctrl + b` followed by `d` to detach.

To check script progress at any point, re-attach to the session:

```bash
tmux attach -t oracle-grabber
```

Once provisioned, your instance will appear in the OCI dashboard with an assigned public IPv4 address ready for SSH access.

![Success](images/image47.png)

With your Always Free cloud instance running, you now have a reliable 24/7 environment to deploy Docker containers, automated workflows, or personal web services at zero cost.