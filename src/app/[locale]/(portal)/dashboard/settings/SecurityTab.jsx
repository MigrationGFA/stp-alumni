

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import userService from '@/lib/services/userService';
import { useMutation } from '@tanstack/react-query';
import { Lock } from 'lucide-react';
import React, { useState } from 'react'

function SecurityTab({ t, updateUser }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePasswordMutation = useMutation({
    mutationFn: userService.changePassword,
    onSuccess: () => {
      toast.success(t("passwordChanged"));
      updateUser({ passwordChangeRequired: false });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t("passwordError"));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) { toast.error(t("fillAllFields")); return; }
    if (newPassword.length < 8) { toast.error(t("passwordMinLength")); return; }
    if (newPassword === oldPassword) { toast.error(t("passwordSameAsOld")); return; }
    if (newPassword !== confirmPassword) { toast.error(t("passwordMismatch")); return; }
    changePasswordMutation.mutate({ oldPassword, newPassword });
  };

  return (
    <div className="bg-white rounded-xl p-6 lg:p-8 max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#155DFC]/10 rounded-lg">
          <Lock className="h-5 w-5 text-[#155DFC]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t("changePassword")}</h2>
          <p className="text-sm text-gray-500">{t("changePasswordDesc")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="oldPassword" className="text-gray-700 mb-2 block">{t("oldPassword")}</Label>
          <Input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder={t("oldPasswordPlaceholder")} disabled={changePasswordMutation.isPending} />
        </div>
        <div>
          <Label htmlFor="newPassword" className="text-gray-700 mb-2 block">{t("newPassword")}</Label>
          <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={t("newPasswordPlaceholder")} disabled={changePasswordMutation.isPending} />
        </div>
        <div>
          <Label htmlFor="confirmPassword" className="text-gray-700 mb-2 block">{t("confirmPassword")}</Label>
          <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t("confirmPasswordPlaceholder")} disabled={changePasswordMutation.isPending} />
        </div>
        <Button type="submit" disabled={changePasswordMutation.isPending} className="w-full h-11 bg-[#155DFC] hover:bg-[#155DFC]/90 text-white mt-2">
          {changePasswordMutation.isPending ? t("updating") : t("updatePassword")}
        </Button>
      </form>
    </div>
  );
}

export default SecurityTab