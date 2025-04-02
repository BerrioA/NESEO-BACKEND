import { Lab } from "../../models/labs.js";

// Controlador encargado de mostrar todos los laboratorios
export const getLabs = async (req, res) => {
  try {
    const labs = await Lab.findAll({
      attributes: ["id", "lab_name", "quotas", "description"],
    });

    return res.status(200).json(labs);
  } catch (error) {
    console.log(
      `¡Oops! Los laboratorios están jugando al escondite. ¡Vuelve a intentarlo pronto! ${error}`
    );

    return res
      .status(500)
      .json(
        "¡Oops! Los laboratorios están jugando al escondite. ¡Vuelve a intentarlo pronto!"
      );
  }
};

// Controlador encargado de registrar laboratorios
export const registerLabs = async (req, res) => {
  try {
    const { lab_name, quotas, description } = req.body;

    const searchlab = await Lab.findOne({ where: { lab_name } });

    if (searchlab) {
      return res.status(400).json({
        error:
          "Lo sentimos, este nombre de laboratorio ya existe. Prueba con uno nuevo",
      });
    }

    await Lab.create({
      lab_name,
      quotas,
      description,
    });

    return res.status(200).json({
      message: "¡Genial! El laboratorio ha sido registrado exitosamente.",
    });
  } catch (error) {
    console.error(
      `¡Vaya! Parece que el registro decidió tomarse un descanso. ¿Podrías intentarlo más tarde?. ${error}`
    );

    return res.status(500).json({
      error:
        "¡Vaya! Parece que el registro decidió tomarse un descanso. ¿Podrías intentarlo más tarde?",
    });
  }
};

// Controlador encargado de actualizar laboratorios
export const updateLabs = async (req, res) => {
  try {
    const { idLab } = req.params;

    const lab = await Lab.findByPk(idLab);

    if (!lab)
      return res.status(400).json({
        error:
          "¡Lo sentimos! No hemos podido encontrar al laboratorio que intentas actualizar.",
      });

    const { lab_name, quotas, description } = req.body;

    //Validación encargada de verificar que el usuario si envie un campo para actualizar y no un objeto vacio
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error:
          "Lo sentimos, no hemos detectado datos para actualizar. Asegúrate de completar los campos necesarios.",
      });
    }

    const searchlab = await Lab.findOne({ where: { lab_name } });

    if (searchlab) {
      return res.status(400).json({
        error:
          "Lo sentimos, este nombre de laboratorio ya existe. Prueba con uno nuevo",
      });
    }

    if (lab_name && lab_name != lab.lab_name) lab.lab_name = lab_name;
    if (quotas && quotas != lab.quotas) lab.quotas = quotas;
    if (description && description != lab.description)
      lab.description = description;

    await lab.update({
      lab_name,
      quotas,
      description,
    });

    return res.status(200).json({
      message:
        "¡Misión cumplida! Los datos del laboratorio han sido actualizados con exito.",
    });
  } catch (error) {
    console.error(
      `No pudimos actualizar los datos. Estamos resolviendo el problema lo antes posible. ${error}`
    );

    return res.status(500).json({
      error:
        "No pudimos actualizar los datos. Estamos resolviendo el problema lo antes posible.",
    });
  }
};

// Controlador encargado de eliminar laboratorios
export const deleteLabs = async (req, res) => {
  try {
    const { idLab } = req.params;

    const lab = await Lab.findByPk(idLab);

    if (!lab)
      return res.status(400).json({
        error:
          "¡Lo sentimos! No hemos podido encontrar al laboratorio que intentas eliminar.",
      });

    await lab.destroy();

    return res.status(200).json({
      message:
        "¡Misión cumplida! Los datos del laboratorio han sido actualizados con exito.",
    });
  } catch (error) {
    console.error(
      `Lo sentimos, no hemos podido eliminar el laboratorio en este momento. ${error}`
    );

    return res.status(500).json({
      error:
        "Lo sentimos, no hemos podido eliminar el laboratorio en este momento.",
    });
  }
};

// Controlador encargado de mostrar un laboratorio por ID
export const getLab = async (req, res) => {
  try {
    const { idLab } = req.params;
    const lab = await Lab.findByPk(idLab, {
      attributes: ["id", "lab_name", "quotas", "description"],
    });

    if (!lab)
      return res.status(400).json({
        error: "¡Lo sentimos! No hemos podido encontrar el laboratorio.",
      });

    return res.status(200).json(lab);
  } catch (error) {
    console.error(
      `Lo sentimos, no hemos podido encontraar el laboratorio en este momento. ${error}`
    );

    return res.status(500).json({
      error:
        "Lo sentimos, no hemos podido encontraar el laboratorio en este momento.",
    });
  }
};
