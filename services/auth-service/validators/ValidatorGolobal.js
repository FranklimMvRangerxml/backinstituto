export const validateGlobal = (fields = []) => {

    return (req, res, next) => {

        const missingFields = [];

        fields.forEach(field => {
            if (!req.body[field]) {
                missingFields.push(field);
            }
        });

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: "Faltan campos requeridos",
                fields: missingFields
            });
        }

        next();

    };

};