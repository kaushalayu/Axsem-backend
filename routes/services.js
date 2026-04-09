const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    if (services.length === 0) {
      return res.json([
        { id: "web", icon: "FiCode", color: "#f05a28", tag: "Web Development", title: "Custom Web Applications", description: "Scalable, high-performance web apps built with React, Next.js, and Node.js.", points: ["React / Next.js", "REST & GraphQL APIs", "SEO-optimized", "Performance-first"], stat: "80+", statLabel: "Web Projects" },
        { id: "mobile", icon: "FiSmartphone", color: "#3d3d9e", tag: "Mobile Development", title: "iOS & Android Apps", description: "Cross-platform mobile apps with Flutter and React Native.", points: ["Flutter & React Native", "Offline-first apps", "Push notifications", "App Store deployment"], stat: "40+", statLabel: "Apps Launched" },
        { id: "cloud", icon: "FiCloud", color: "#6b3fa0", tag: "Cloud & DevOps", title: "Cloud Infrastructure", description: "AWS, GCP, and Azure deployment with CI/CD pipelines.", points: ["AWS / GCP / Azure", "Docker & Kubernetes", "CI/CD pipelines", "24/7 monitoring"], stat: "99.9%", statLabel: "Uptime SLA" },
        { id: "ui", icon: "FiLayers", color: "#e63b2a", tag: "UI/UX Design", title: "Product Design & UX", description: "Research-driven design that converts.", points: ["User research", "Figma prototyping", "Design systems", "Usability testing"], stat: "100%", statLabel: "Client Approval" },
        { id: "erp", icon: "FiDatabase", color: "#f05a28", tag: "ERP & CRM", title: "ERP & Business Systems", description: "Custom ERP, CRM, and inventory systems.", points: ["Inventory management", "Billing & invoicing", "HR & payroll", "Custom dashboards"], stat: "30+", statLabel: "ERP Deployments" },
        { id: "security", icon: "FiShield", color: "#3d3d9e", tag: "Security", title: "Security & Maintenance", description: "Security audits, performance optimization, and support.", points: ["Security audits", "Performance tuning", "Regular updates", "Dedicated support"], stat: "5+", statLabel: "Years Support" },
      ]);
    }
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findOne({ id: req.params.id });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const service = new Service(req.body);
    const saved = await service.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    let service = await Service.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!service) {
      service = await Service.create({ id: req.params.id, ...req.body });
    }
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Service.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
