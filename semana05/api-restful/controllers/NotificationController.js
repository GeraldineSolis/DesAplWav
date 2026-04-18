const NotificationService = require("../services/NotificationService");
const service = new NotificationService();

exports.list = (req, res) => {
  res.status(200).json(service.list());
};

exports.listByTicket = (req, res) => {
    const { id } = req.params;
    const notifications = service.listByTicket(id);
    res.status(200).json(notifications);
};