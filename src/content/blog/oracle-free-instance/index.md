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
draft: true


# --- Images ---

# Cover Image: place your image in the same folder as this file (e.g. `cover.png`) and uncomment the line below.
coverImage: "./cover.png"
coverAlt: "Oracle Cloud dashboard showing Always Free instance status"


# --- The Discriminator ---

# Category must exactly be one of: 'blog', 'project', 'participation', 'learning', 'random'
category: "blog"

---

## Introduction

Today, I will show you how to get a free instance in Oracle Cloud Always Free Tier. It will be a lot of screenshot. So, you can follow along. The most important thing that I want to show you is not these screenshot, but a script to run when facing `Out of Capacity` Problem. 

Many people face this specific problem because Oracle only give a small pool of instances for all the Free Account. Since Oracle Free Instance is very popular some region is out of capacity when you try to create a new instance. 

However, I got a workaround for that. Stay tune till the end! 

You can also skip and go straight there with the table of content!

## Get Start With Creating Account

Visit this link: [www.oracle.com/cloud/](https://www.oracle.com/cloud/), we will start from here. 

1. Click `Try OCI for free`.

![Oracle Cloud](images/image57.png)

This page below, you can scroll down and see what Oracle Cloud Services are available to your free account, or you can create account now.

2. Click `Start for free`.

![Free Tier](images/image23.png)

3. This page below, you fill your basic info.

![Basic Info Form](images/image25.png)

4. Please create password according to its rules. 

![Password and Rules](images/image16.png)

5. Put any name you like as your username. 

**Important** `You can only create the Free Instance in your Home Region.` You cannot change it later. So, if you want to create the instance in Singapore, You will pick Singapore as your home region. You should do research about it too, sometimes, the instance is not available in your home region, so you should pick somewhere close to your real Home Region/Country. 

![Picking Home Region Screen](images/image8.png)

6. It will send you Email. Just click `Verify Email`.

![Confirm Email](images/image15.png)

7. Fill all the mandatory fields.

![Address and Location](images/image41.png)

8. Add your payment method. 

**Note** You cannot use pre-paid card. You must use debit/credit card. They won't charge you anything at this stage. They only want to verify if you are a real person. 

![Add Payment Method to Verify](images/image48.png)

9. Fill your information and Credit Card information.

![Add Payment Method Page](images/image49.png)

10. Create Your Account!

![Agree the Term and Craete Account](images/image50.png)

11. You can wait a little while. It will email you.

![Wait Page](images/image34.png)

12. You can wait a little while. It will email you.

![Wait Page 2](images/image20.png)

13. Completed!!! You can log in now. 

![Email Account Creation Completed](images/image19.png)

14. This Page you will be force to create 2-Factor-Authentication which is good to secure your account and cloud. 

![2-factor-auth](images/image43.png)

15. ***Tip*** *If you are using other authentication app, like Microsoft Authentication or Google Authentication or Bitwarden ... 
Then, you can click the `Use Offline` or `Another Authentication App`. You don't have to use Oracle Authentication App.*

![2-factor-auth-setup](images/image6.png)

16. We are in.

![We are in](images/image31.png)

## Create Instance

### Start Creating VM

17. Dashboard's View: Click `Create a VM instance` under Build & Compute

![Dashboard's View](images/image11.png)

18. Name your instance and choose availability domain.

![Name Instance](images/image17.png)

19. Here, you can change the Operating System Image. Click `Change image`.

![OS Image](images/image55.png)

20. For me, I pick `ubuntu`.

![OS Image Selection](images/image39.png)

21. Scroll Down a bit, you can select Ubuntu Version. For me, I pick `24.04 Minimal` because it is the latest LTS version and Minimal so I can save some resources. 

![OS Version Selection](images/image32.png)

22. After selecting your image, you can view the shape of your instance (spec). Click `Change Shape`.

![Server Spec](images/image37.png)

23. Okay...

![VM and Special Instance?](images/image26.png)

24. Scroll Down a little bit, it will show you the `Always Free Eligible`. NICE (Side note: 1 OCPU = 1 Cores)

![Free Tier Available](images/image53.png)

25. Sadly, the ampere instance is not available for me for now. It is because I use `Minimal` image. If you want to get the Ampere Instace, you can use other OS Image the Non-Minimal Image. 

![No Ampere Instance :(](images/image4.png)

26. After Selecting Shape, we can confirm it. 

![Instance Shape](images/image36.png)

27. As for this security, if we turn it on, it will be more secure against boot level malware, but it will be hard to change boot drive and some other configuration settings ... So, I leave it off. 

![Security](images/image14.png)

28. Somehow, It doesn't automatically create VCN for me. :( I will show you the full picture here, and How to create a VCN.

![Create New VCN?!](images/image27.png)

![Subnet](images/image24.png)

![Public Subnet](images/image45.png)

29. WE need IPv4 Address!

![No IPv4?](images/image1.png)

### Creating VCN


30. First You need to open `another browser tab` with Oracle Cloud. Then, click the `Hamburger Icon > Networking > Overview`

![Network Oracle Services Listing Page](images/image21.png)

31. Click `Create VCN Wizard`. This is the easiest way to create VCN. If we were to do it another way, We would need to create VCN, Subnet, Gateway, Route Table, NAT ...

![Networking Overview](images/image42.png)

32. Fill in the name.

![Naming VCN](images/image33.png)

33. Fill anything you need to fill and leave things at default.

![VCN Configuratoin CIDR...](images/image30.png)

34. Make sure private subnet and public subnet are on different subnet block. You can follow me if it is not filled by default.

![Public and Private Subnet CIDR](images/image2.png)

35. After we fill everything, click `Next` and `Create`.

![Summary Page before Creation](images/image54.png)

36. You can see, it creates everything for us. You can click `View VCN`. 

![VCN Creating](images/image29.png)

37. VCN Page. You can close this browser tab now.

![VCN Listing Page](images/image12.png)

### Back to Instance Creation Page

38. The newly created VCN may not appear, so you need to just change it to different options to make it refresh. Then go back to `Select existing virtual cloud network`. You will see that `my-primary-vcn` appear. 

![Configure VCN](images/image35.png)

39. Finally, we have IPv4 on Public Subnet and IPv4 Assignment. You don't have to do anything, it will fill it self.

![IPv4 on Public Subnet](images/image9.png)

![IPv4 Assignment](images/image28.png)

40. This is the SSH setup. If you already have a SSH server with Public and Private Key elsewhere, you can use it here, by `Paste public key` or `Upload public key file (.pub)`. Oracle will use `PEM` format, make sure you have public key in this format. 

If you don't have key or want to keep things separated, you can choose `Generate a key pair for me`. Make sure you download it because this is the only time you will see it. `Not using SSH Keys is NOT Recommened`.

![SSH Key setup.](images/image46.png)

41. Boot Volume, Leave everything at default. Then `Next`

![Boot Volume](images/image22.png).

42. You will see this summary page and you can click `Create`

![Summary Page for Instance](images/image51.png)

43. OHHHH NOO, It is out of capacity. 

![API request error, OUT OF CAPACITY](images/image10.png)

<!-- ![](images/image18.png)

![](images/image56.png)

![](images/image40.png)

Fuck 110$ just to verify my card, fortunately, I am put limit on my card that mf -->

## Workaround for the Out of Capacity Problem (Linux)

If you see the 'Out of Capacity' error, don't panic. This doesn't mean you can't have a server; it just means you have to be the first in line when someone else deletes theirs. We are going to build a 'line-bot' using Terraform

44. At the summary page, click `Save as stack`. This will save the everything we did earlier in Stack and this page will appear. Then you will need to `Download Terraform configuration`. This will download a zip file that contain Terraform config. From this step, we will working mostly on our computer. 

![Stack Job Page](images/image52.png)

45. I will use my homeserver to run the script. So, I will show you from my server. Then run this command. 

***Note*** *You need to replace <Your Downloaded Terraform Config.zip> with your actual file name.* 

```bash
mkdir ~/oracle-instance-grapper

cd oracle-instance-grapper

unzip ~/Downloads/\<Your Downloaded Terraform Config.zip\>

ls

sudo apt install tmux # Tmux is use for run background process.
```

![List files and Install Tmux](images/image38.png)

46. Visit: [Install Terraform from Hashicorp](https://developer.hashicorp.com/terraform/install) Then choose your OS. Mine is Linux.

![Hashicorp Developer Website](image.png)

47. Choose your distro according to your host machine. Copy the script and run it on your terminal.

![Installation Script](image-1.png)

![Install from Terminal](images/image44.png)

48. We will need to create bash script to automate creation process. 

<!-- ![](images/image13.png) -->
```bash
nano grab_oracle.sh
```

Then, paste this scipt. 

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

49. Now, we need to update the `main.tf` with our oracle cloud credential. How to find it?

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

### Finding Credentail to run Terraform

50. Click `Tenancy: Username` then click copy OCID start with `ocid1.tenancy.oc1..`

![Account info in Oracle](image-3.png)

![Account Tenancy Detail](image-4.png)

51. We can find User OCID by click on `User Setting`

![Account info in Oracle](image-3.png)

![User Setting](image-5.png)

52. We need to create the `Tokens and Keys` to get the fingerprint

![Detail Tabs](image-6.png)

53. `Add API Key`

![Add API Key Page](image-7.png)

54. This is similar to SSH situation. Just `Download private key` and it will create you the API key. Then click `Add` at the bottom right corner.

![Creating Tokens and Key](image-8.png)

55. It will show you the key and everything.

### Running the Script

56. After get the infomation, you can save the `main.tf`. Then you will need to know where is the private key you have download it. 

```bash
ls ~/Downloads | grep key
```

57. You can move it to other location such as `.oci`

```bash
mkdir -p ~/.oci

mv ~/Downloads/<your file name.key> ~/.oci/key.pem

sudo chmod 400 ~/.oci/key.pem # Most SSH clients and Terraform will throw an error or refuse to run if the private key file permissions are too "open" (readable by others).
```

58. Now, we have everything we need. Let's check the script and start terraform init.

```bash
ls

terraform init
```
![Listing file and start tmux session](images/image5.png)

59. Inside, Tmux session, you can start this last command.

```bash
tmux new -s oracle-grapper

sudo chmod +x grab_oracle.sh

./grab_oracle.sh
```

![Start Running!!!](images/image7.png)

60. Yes, it will fail most of the time. The Idea of the script is that, it will try to create instance for you indefinitelly. It will retry every `60 seconds`. As soon as, the capacity available you will grab that instance. I put 60s to avoid getting block by oracle, if you send too many request it may flag you as DoS or DDoS attack. lol.

To exist this tmux sesssion without stopping the script is to `hold ctrl then press b and press d (Ctrl + b d)`. You will detach from that session. 

What do we do after this? 

We wait. No, you don't have to wait. You just need to forget about it and do your work normally. Maybe after a few hours you may get one.

**Important**, If you turn your computer off, the script will stop. You can restart again by repeating step `59`.

If you need to check how it is doing use this command: `tmux attach -t oracle-grapper`.

I got mine after 5 hours. 

![Success](images/image47.png)

Thank you for reading up until this point. I hope you get your Free Instance Soon. 

bye bye see you next time.