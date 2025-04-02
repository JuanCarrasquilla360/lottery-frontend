import React from "react";
import { Container, Typography, List, ListItem } from "@mui/material";
import MainLayout from "../components/layout/MainLayout";

const Terminos: React.FC = () => {
  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Términos y Condiciones
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
          Quiénes somos
        </Typography>
        <Typography paragraph>
          La dirección de nuestra web es: https://inversionestintafina.com
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
          Métodos de pago:
        </Typography>
        <Typography paragraph>
          Los métodos de pago disponibles en el sitio web
          https://inversionestintafina.com son:
        </Typography>
        <List>
          <ListItem>
            <Typography>
              Pagos en línea (tarjeta de crédito o débito, PSE, pagos en
              efectivo en tiendas aliadas) mediante la pasarela de pagos
              Epayco.
            </Typography>
          </ListItem>
        </List>
        <Typography paragraph>
          Desde nuestro Ecommerce no capturamos, almacenamos ni transmitimos
          datos transaccionales. Para esto contamos con los servicios de
          Epayco, que es una plataforma de pagos certificada; que garantiza la
          seguridad de todas las transacciones por medio de software de
          encriptación, procedimientos de validación y medidas robustas de
          protección de datos a nivel bancario (certificación PCI nivel 1). Por
          eso realizar los pagos en nuestro sitio web es seguro.
        </Typography>
        <Typography paragraph>
          Si su pago es con PSE, la pasarela de pagos Epayco se encarga de
          comunicarlo directamente con su banco a través de ACH, al pagar a
          través de este canal, está utilizando los procesos de seguridad de su
          propio banco quien es el que valida su clave principal y segunda clave
          si es el caso.
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
          Números Premiados o Premio
        </Typography>
        <Typography paragraph>
          En caso de resultar ganador de algún número premiado o el premio
          mayor, el participante deberá enviar un video en el que se muestre la
          información pertinente y se verifique que todo es legal. Al enviar
          dicho video, el participante otorga su autorización para que el
          contenido sea publicado en nuestras redes sociales.
        </Typography>
        <Typography paragraph>
          Las compras no son acumulables, solo es válido para la compra donde
          registre el número ganador.
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
          Comentarios
        </Typography>
        <Typography paragraph>
          Cuando los visitantes dejan comentarios en la web, recopilamos los
          datos que se muestran en el formulario de comentarios, así como la
          dirección IP del visitante y la cadena de agentes de usuario del
          navegador para ayudar a la detección de spam.
        </Typography>
        <Typography paragraph>
          Una cadena anónima creada a partir de tu dirección de correo
          electrónico (también llamada hash) puede ser proporcionada al servicio
          de Gravatar para ver si la estás usando. La política de privacidad del
          servicio Gravatar está disponible aquí:
          https://automattic.com/privacy/. Después de la aprobación de tu
          comentario, la imagen de tu perfil es visible para el público en el
          contexto de tu comentario.
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
          Cookies
        </Typography>
        <Typography paragraph>
          Si dejas un comentario en nuestro sitio puedes elegir guardar tu
          nombre, dirección de correo electrónico y web en cookies. Esto es para
          tu comodidad, para que no tengas que volver a rellenar tus datos
          cuando dejes otro comentario. Estas cookies tendrán una duración de un
          año.
        </Typography>
        <Typography paragraph>
          Si tienes una cuenta y te conectas a este sitio, instalaremos una
          cookie temporal para determinar si tu navegador acepta cookies. Esta
          cookie no contiene datos personales y se elimina al cerrar el
          navegador.
        </Typography>
        <Typography paragraph>
          Cuando accedas, también instalaremos varias cookies para guardar tu
          información de acceso y tus opciones de visualización de pantalla. Las
          cookies de acceso duran dos días, y las cookies de opciones de
          pantalla duran un año. Si seleccionas «Recuérdame», tu acceso
          perdurará durante dos semanas. Si sales de tu cuenta, las cookies de
          acceso se eliminarán.
        </Typography>
        <Typography paragraph>
          Si editas o publicas un artículo se guardará una cookie adicional en
          tu navegador. Esta cookie no incluye datos personales y simplemente
          indica el ID del artículo que acabas de editar. Caduca después de 1
          día.
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
          Contenido incrustado de otros sitios web
        </Typography>
        <Typography paragraph>
          Los artículos de este sitio pueden incluir contenido incrustado (por
          ejemplo, videos, imágenes, artículos, etc.). El contenido incrustado
          de otras webs se comporta exactamente de la misma manera que si el
          visitante hubiera visitado la otra web.
        </Typography>
        <Typography paragraph>
          Estas webs pueden recopilar datos sobre ti, utilizar cookies,
          incrustar un seguimiento adicional de terceros, y supervisar tu
          interacción con ese contenido incrustado, incluido el seguimiento de
          tu interacción con el contenido incrustado si tienes una cuenta y
          estás conectado a esa web.
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
          Con quién compartimos tus datos
        </Typography>
        <Typography paragraph>
          Si solicitas un restablecimiento de contraseña, tu dirección IP será
          incluida en el correo electrónico de restablecimiento.
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
          Cuánto tiempo conservamos tus datos
        </Typography>
        <Typography paragraph>
          Si dejas un comentario, el comentario y sus metadatos se conservan
          indefinidamente. Esto es para que podamos reconocer y aprobar
          comentarios sucesivos automáticamente, en lugar de mantenerlos en una
          cola de moderación.
        </Typography>
        <Typography paragraph>
          De los usuarios que se registran en nuestra web (si los hay), también
          almacenamos la información personal que proporcionan en su perfil de
          usuario. Todos los usuarios pueden ver, editar o eliminar su
          información personal en cualquier momento (excepto que no pueden
          cambiar su nombre de usuario). Los administradores de la web también
          pueden ver y editar esa información.
        </Typography>
      </Container>
    </MainLayout>
  );
};

export default Terminos;
