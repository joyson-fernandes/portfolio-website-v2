# CI/CD Pipeline Setup Guide

This guide will help you set up a complete CI/CD pipeline for your portfolio website using GitLab CI/CD and Kubernetes.

## 🏗️ Architecture Overview

```
GitLab Repository → GitLab CI/CD → Docker Registry → Kubernetes Cluster
```

## 📋 Prerequisites

1. **GitLab Account** with a project repository
2. **Local Kubernetes Cluster** (minikube, k3s, or similar)
3. **Docker** installed on your system
4. **kubectl** configured to access your cluster

## 🚀 Setup Steps

### 1. GitLab Repository Setup

1. Create a new GitLab project or use existing one
2. Push your code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://gitlab.com/YOUR_USERNAME/joyson_portfolio_website-v2.git
   git push -u origin main
   ```

### 2. GitLab Runner Setup

Run the setup script:
```bash
./setup-gitlab-runner.sh
```

Then register the runner:
```bash
sudo gitlab-runner register
```

### 3. Configure GitLab CI/CD Variables

Go to your GitLab project → Settings → CI/CD → Variables and add:

| Variable | Value | Description |
|----------|-------|-------------|
| `KUBECONFIG` | Base64 encoded kubeconfig | Your cluster access config |
| `CI_REGISTRY_USER` | Your GitLab username | For container registry access |
| `CI_REGISTRY_PASSWORD` | GitLab access token | For container registry access |

#### Getting your KUBECONFIG:
```bash
# Encode your kubeconfig
cat ~/.kube/config | base64 -w 0
```

#### Creating GitLab Access Token:
1. Go to GitLab → User Settings → Access Tokens
2. Create token with `read_registry` and `write_registry` scopes

### 4. Update Kubernetes Manifests

Edit `k8s/deployment.yaml` and update the image URL:
```yaml
image: registry.gitlab.com/YOUR_GITLAB_USERNAME/joyson_portfolio_website-v2/portfolio:latest
```

### 5. Deploy to Kubernetes

Initial deployment:
```bash
./deploy.sh
```

### 6. Configure Ingress (Optional)

If using ingress, update your `/etc/hosts` file:
```bash
echo "127.0.0.1 portfolio.local" | sudo tee -a /etc/hosts
```

## 🔄 CI/CD Workflow

1. **Push to main/master/develop** → Triggers pipeline
2. **Build Stage**: Creates Docker image and pushes to GitLab registry
3. **Deploy Stage**: Updates Kubernetes deployment (manual trigger)

## 📊 Monitoring

### Check Pipeline Status
- GitLab Project → CI/CD → Pipelines

### Check Kubernetes Deployment
```bash
kubectl get pods -n portfolio
kubectl logs -f deployment/portfolio-deployment -n portfolio
```

### Access Application
- **Local**: `http://localhost` (if using ingress)
- **Port Forward**: `kubectl port-forward svc/portfolio-service 3000:80 -n portfolio`

## 🛠️ Useful Commands

### GitLab Runner
```bash
# Check runner status
sudo gitlab-runner status

# Restart runner
sudo gitlab-runner restart
```

### Kubernetes
```bash
# Scale deployment
kubectl scale deployment portfolio-deployment --replicas=3 -n portfolio

# Update image manually
kubectl set image deployment/portfolio-deployment portfolio=NEW_IMAGE -n portfolio

# Check rollout status
kubectl rollout status deployment/portfolio-deployment -n portfolio
```

### Docker
```bash
# Build locally
cd app && docker build -t portfolio:local .

# Run locally
docker run -p 3000:3000 portfolio:local
```

## 🔧 Troubleshooting

### Pipeline Fails
1. Check GitLab CI/CD variables are set correctly
2. Verify runner has access to Docker and Kubernetes
3. Check logs in GitLab → CI/CD → Jobs

### Deployment Issues
1. Check pod logs: `kubectl logs -f POD_NAME -n portfolio`
2. Verify secrets are created: `kubectl get secrets -n portfolio`
3. Check service endpoints: `kubectl get endpoints -n portfolio`

### Image Pull Issues
1. Verify registry credentials
2. Check image exists in GitLab Container Registry
3. Ensure runner can access GitLab registry

## 🔐 Security Notes

1. **Change default passwords** in `k8s/secrets.yaml`
2. **Use proper RBAC** for production deployments
3. **Secure your GitLab tokens** and rotate regularly
4. **Use network policies** to restrict pod communication

## 📈 Next Steps

1. **Add monitoring** with Prometheus/Grafana
2. **Set up alerts** for deployment failures
3. **Implement blue-green deployments**
4. **Add automated testing** in pipeline
5. **Set up SSL/TLS** with cert-manager

## 🎉 Success!

Your CI/CD pipeline is now ready! Every push to your main branch will trigger a build, and you can deploy with a single click in GitLab.
