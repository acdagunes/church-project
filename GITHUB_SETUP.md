# GitHub-ზე ატვირთვის ინსტრუქცია

## ✅ რა გაკეთდა უკვე

Git repository ლოკალურად მზადაა:
- ✅ Git initialized
- ✅ ყველა ფაილი დაემატა (47 files, 8639 lines)
- ✅ Initial commit შექმნილია
- ✅ Branch გადარქმეულია `main`-ად

---

## 📋 შემდეგი ნაბიჯები

### 1. GitHub-ზე Repository შექმნა

**ვარიანტი A: ბრაუზერიდან**
1. გადადით: https://github.com/new
2. Repository name: `church-project` (ან სხვა სახელი)
3. Description: "Full-stack church website with React and Node.js"
4. **არ მონიშნოთ** "Initialize with README" (უკვე გვაქვს)
5. დააჭირეთ "Create repository"

**ვარიანტი B: GitHub CLI-დან** (თუ გაქვთ დაინსტალირებული)
```bash
gh repo create church-project --public --source=. --remote=origin
```

---

### 2. Remote Repository-ის დამატება

GitHub-ზე repository შექმნის შემდეგ, გაუშვით:

```bash
cd C:\Users\user\Desktop\gravity\church-project
git remote add origin https://github.com/YOUR_USERNAME/church-project.git
```

**ჩაანაცვლეთ `YOUR_USERNAME` თქვენი GitHub username-ით!**

---

### 3. Push to GitHub

```bash
git push -u origin main
```

თუ GitHub-ზე authentication გჭირდებათ:
- **Personal Access Token** გამოიყენეთ password-ის ნაცვლად
- ან დააკონფიგურირეთ SSH key

---

## 🔐 Authentication Setup (თუ საჭიროა)

### Personal Access Token შექმნა

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token (classic)"
3. Select scopes: `repo` (full control)
4. Generate token და დააკოპირეთ

### Token-ის გამოყენება

როცა `git push` გაუშვებთ და password-ს მოითხოვს:
- Username: თქვენი GitHub username
- Password: **დააკოპირებული token** (არა რეალური პაროლი)

---

## 📝 სრული ბრძანებები ერთად

```bash
# 1. Remote დამატება (ჩაანაცვლეთ YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/church-project.git

# 2. Push
git push -u origin main

# 3. შემოწმება
git remote -v
```

---

## ✅ რას ელოდეთ

Push-ის შემდეგ GitHub-ზე დაინახავთ:
- ✅ 47 ფაილს
- ✅ README.md (ავტომატურად გამოჩნდება)
- ✅ DEPLOYMENT.md
- ✅ .github/workflows/ci-cd.yml
- ✅ Frontend და Backend კოდი

---

## 🎯 შემდეგი ნაბიჯები GitHub-ის შემდეგ

1. **MongoDB Atlas** კონფიგურაცია
2. **Admin User** შექმნა
3. **Digital Ocean** deployment
4. **დომეინის** მიბმა

ყველაფერი აღწერილია `DEPLOYMENT.md`-ში! 🚀
