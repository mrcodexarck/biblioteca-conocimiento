const {
  onDocumentCreated,
} = require('firebase-functions/v2/firestore');

const {
  getFirestore,
} = require('firebase-admin/firestore');

const {
  initializeApp,
} = require('firebase-admin/app');


/*
 * =========================================================
 * INICIALIZACIÓN
 * =========================================================
 */

initializeApp();

const db = getFirestore();


/*
 * =========================================================
 * NOTIFICACIÓN DE RESPUESTA DE ADMINISTRADOR
 * =========================================================
 *
 * Escucha:
 *
 * suggestions/{suggestionId}/messages/{messageId}
 *
 * Cuando un administrador crea una respuesta:
 *
 * 1. Obtiene la sugerencia.
 * 2. Obtiene el correo del autor.
 * 3. Obtiene el contenido de la respuesta.
 * 4. Crea un documento en "mail".
 *
 * La extensión Trigger Email será la encargada
 * de enviar físicamente el correo.
 */

exports.notifySuggestionAuthor =
  onDocumentCreated(
    'suggestions/{suggestionId}/messages/{messageId}',
    async (event) => {

      const messageSnapshot =
        event.data;

      if (!messageSnapshot) {
        console.error(
          'No se recibió el documento del mensaje.',
        );

        return;
      }

      const messageData =
        messageSnapshot.data();

      const suggestionId =
        event.params.suggestionId;


      try {

        /*
         * ---------------------------------------------------
         * OBTENER SUGERENCIA
         * ---------------------------------------------------
         */

        const suggestionRef =
          db
            .collection('suggestions')
            .doc(suggestionId);

        const suggestionSnapshot =
          await suggestionRef.get();

        if (!suggestionSnapshot.exists) {
          console.error(
            'No existe la sugerencia:',
            suggestionId,
          );

          return;
        }

        const suggestion =
          suggestionSnapshot.data();


        /*
         * ---------------------------------------------------
         * DATOS DEL AUTOR
         * ---------------------------------------------------
         */

        const authorEmail =
          String(
            suggestion.authorEmail || '',
          ).trim();

        const authorName =
          String(
            suggestion.authorName ||
              'Usuario',
          ).trim();

        const suggestionTitle =
          String(
            suggestion.title ||
              'Tu sugerencia',
          ).trim();


        /*
         * ---------------------------------------------------
         * DATOS DE LA RESPUESTA
         * ---------------------------------------------------
         */

        const messageText =
          String(
            messageData.text || '',
          ).trim();

        const adminName =
          String(
            messageData.authorName ||
              'Administración',
          ).trim();


        /*
         * ---------------------------------------------------
         * VALIDACIONES
         * ---------------------------------------------------
         */

        if (!authorEmail) {
          console.error(
            'La sugerencia no tiene authorEmail:',
            suggestionId,
          );

          return;
        }

        if (!messageText) {
          console.error(
            'La respuesta está vacía:',
            messageSnapshot.id,
          );

          return;
        }


        /*
         * ---------------------------------------------------
         * CREAR DOCUMENTO PARA TRIGGER EMAIL
         * ---------------------------------------------------
         */

        await db
          .collection('mail')
          .add({
            to: authorEmail,

            message: {
              subject:
                'Nueva respuesta a tu sugerencia',

              text: `
Hola ${authorName},

El administrador ha respondido a tu sugerencia:

"${suggestionTitle}"

Respuesta de ${adminName}:

${messageText}

Puedes ingresar a la Biblioteca de Conocimiento para consultar el seguimiento completo de tu sugerencia.

Biblioteca de Conocimiento
`,

              html: `
                <div
                  style="
                    font-family:
                      Arial,
                      sans-serif;
                    line-height: 1.6;
                    color: #1f2937;
                    max-width: 650px;
                    margin: 0 auto;
                  "
                >

                  <div
                    style="
                      padding: 24px 0;
                      border-bottom:
                        1px solid #e5e7eb;
                    "
                  >
                    <h1
                      style="
                        margin: 0;
                        color: #2e8555;
                      "
                    >
                      Biblioteca de Conocimiento
                    </h1>
                  </div>

                  <div
                    style="
                      padding: 28px 0;
                    "
                  >

                    <p>
                      Hola
                      <strong>
                        ${escapeHtml(
                          authorName,
                        )}
                      </strong>,
                    </p>

                    <p>
                      El administrador ha respondido
                      a tu sugerencia:
                    </p>

                    <div
                      style="
                        background:
                          #f6f8f7;
                        border-left:
                          4px solid #2e8555;
                        padding: 16px;
                        margin: 20px 0;
                      "
                    >
                      <strong>
                        ${escapeHtml(
                          suggestionTitle,
                        )}
                      </strong>
                    </div>

                    <p>
                      <strong>
                        Respuesta de
                        ${escapeHtml(
                          adminName,
                        )}:
                      </strong>
                    </p>

                    <div
                      style="
                        background:
                          #ffffff;
                        border:
                          1px solid #e5e7eb;
                        border-radius:
                          10px;
                        padding:
                          18px;
                        white-space:
                          pre-line;
                      "
                    >
                      ${escapeHtml(
                        messageText,
                      )}
                    </div>

                    <p
                      style="
                        margin-top: 28px;
                      "
                    >
                      Puedes ingresar a la
                      Biblioteca de Conocimiento
                      para consultar el seguimiento
                      completo de tu sugerencia.
                    </p>

                  </div>

                  <div
                    style="
                      border-top:
                        1px solid #e5e7eb;
                      padding:
                        18px 0;
                      color:
                        #667085;
                      font-size:
                        13px;
                    "
                  >
                    Este mensaje fue generado
                    automáticamente.
                  </div>

                </div>
              `,
            },

            createdAt: new Date(),
          });


        console.log(
          `Correo preparado para ${authorEmail}.`,
        );

      } catch (error) {

        console.error(
          'Error preparando correo:',
          error,
        );
      }
    },
  );


/*
 * =========================================================
 * ESCAPE HTML
 * =========================================================
 *
 * Evitamos que contenido proporcionado por usuarios
 * se interprete como HTML dentro del correo.
 */

function escapeHtml(value) {
  return String(value)
    .replace(
      /&/g,
      '&amp;',
    )
    .replace(
      /</g,
      '&lt;',
    )
    .replace(
      />/g,
      '&gt;',
    )
    .replace(
      /"/g,
      '&quot;',
    )
    .replace(
      /'/g,
      '&#039;',
    );
}