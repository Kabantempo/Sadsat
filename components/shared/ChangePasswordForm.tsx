"use client";
import { useState, useActionState } from "react";
import { changePasswordAction, type ChangePasswordState } from "@/app/actions/auth";
import { ChevronDown, Eye, EyeOff } from "lucide-react";

export default function ChangePasswordForm() {
  const [open, setOpen] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [state, action, pending] = useActionState<ChangePasswordState, FormData>(
    changePasswordAction,
    undefined
  );

  const fieldClass =
    "w-full border border-neutral-200 px-4 py-2.5 text-[0.85rem] text-neutral-900 bg-white outline-none focus:border-neutral-700 transition-colors pr-10";

  return (
    <div className="bg-white border-t border-neutral-200">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-8 group text-left"
      >
        <div>
          <p className="text-[0.6rem] tracking-[0.2em] uppercase text-neutral-400 mb-1">
            Sécurité
          </p>
          <p className="text-[0.9rem] text-neutral-700">Changer le mot de passe</p>
        </div>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={`text-neutral-400 group-hover:text-neutral-700 transition-all duration-300 shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <form action={action} className="px-8 pb-8 space-y-4">

          {state?.success && (
            <div className="bg-green-50 border border-green-200 px-4 py-3 text-[0.72rem] text-green-700">
              {state.message}
            </div>
          )}
          {state?.message && !state.success && (
            <div className="bg-red-50 border border-red-200 px-4 py-3 text-[0.72rem] text-red-600">
              {state.message}
            </div>
          )}

          <div>
            <label className="block text-[0.6rem] tracking-[0.16em] uppercase text-neutral-500 mb-1.5">
              Mot de passe actuel
            </label>
            <div className="relative">
              <input
                name="currentPassword"
                type={showCurrent ? "text" : "password"}
                required
                autoComplete="current-password"
                className={fieldClass}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[0.6rem] tracking-[0.16em] uppercase text-neutral-500 mb-1.5">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                name="newPassword"
                type={showNew ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="8 caractères minimum"
                className={fieldClass}
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[0.6rem] tracking-[0.16em] uppercase text-neutral-500 mb-1.5">
              Confirmer le nouveau mot de passe
            </label>
            <input
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              className={fieldClass}
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full py-3 bg-neutral-900 text-white text-[0.62rem] tracking-[0.22em] uppercase font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50 mt-2"
          >
            {pending ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}
