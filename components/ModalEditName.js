import { useContext, useState, useEffect } from "react";
import mixpanel from "mixpanel-browser";
import ClientOnlyPortal from "./ClientOnlyPortal";
import AppContext from "../context/app-context";
import CloseButton from "./CloseButton";

export default function Modal({ isOpen, setEditModalOpen }) {
  const context = useContext(AppContext);
  const [nameValue, setNameValue] = useState(null);

  useEffect(() => {
    if (context.myProfile) {
      setNameValue(context.myProfile.name);
    }
  }, [context.myProfile]);

  const handleSubmit = async (event) => {
    mixpanel.track("Save profile name edit");
    event.preventDefault();

    // Post changes to the API
    await fetch(`/api/editname`, {
      method: "post",
      body: JSON.stringify({
        name: nameValue,
      }),
    });

    // Update state to immediately show changes
    context.setMyProfile({
      ...context.myProfile,
      name: nameValue ? (nameValue.trim() ? nameValue.trim() : null) : null, // handle names with all whitespaces
    });

    setEditModalOpen(false);
  };
  return (
    <>
      {isOpen && (
        <ClientOnlyPortal selector="#modal">
          <div className="backdrop" onClick={() => setEditModalOpen(false)}>
            <div
              className="modal"
              style={{ color: "black" }}
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit}>
                <CloseButton setEditModalOpen={setEditModalOpen} />
                <div
                  className="text-3xl border-b-2 pb-2"
                  style={{ fontWeight: 600 }}
                >
                  Edit name
                </div>
                <div className="my-8">
                  <input
                    name="name"
                    placeholder="Your Name"
                    value={nameValue}
                    autoFocus
                    onChange={(e) => {
                      setNameValue(e.target.value);
                    }}
                    type="text"
                    maxLength="50"
                    className="w-full"
                    style={{
                      color: "black",
                      padding: 10,
                      borderRadius: 7,

                      borderWidth: 2,
                      borderColor: "#999",
                    }}
                  />
                </div>
                <div className="border-t-2 pt-4">
                  <button
                    type="submit"
                    className="showtime-green-button px-5 py-3 float-right"
                    style={{ borderColor: "#35bb5b", borderWidth: 2 }}
                    //onClick={() => setEditModalOpen(false)}
                  >
                    Save changes
                  </button>
                  <button
                    type="button"
                    className="showtime-black-button-outline px-5 py-3"
                    onClick={() => {
                      setEditModalOpen(false);
                      setNameValue(context.myProfile.name);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
            <style jsx>{`
              :global(body) {
                overflow: hidden;
              }
              .backdrop {
                position: fixed;
                background-color: rgba(0, 0, 0, 0.7);
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
              }
              .modal {
                background-color: white;
                position: absolute;
                top: 10%;
                right: 10%;
                left: 10%;
                padding: 1em;
                border-radius: 7px;
                max-width: 400px;
                margin-left: auto;
                margin-right: auto;
              }
            `}</style>
          </div>
        </ClientOnlyPortal>
      )}
    </>
  );
}
