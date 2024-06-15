import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonButton, IonicModule, IonInput} from '@ionic/angular';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {TranslateModule} from '@ngx-translate/core';
import {CommonService} from '../../services';

@Component({
    selector: 'app-password-recovery-code',
    templateUrl: './password-recovery-code.page.html',
    styleUrls: ['./password-recovery-code.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, RouterLink, TranslateModule]
})
export class PasswordRecoveryCodePage implements OnInit {
    route = inject(ActivatedRoute);
    router = inject(Router);

    constructor() {
    }

    async ngOnInit() {
    }

    async gotoNextField(nextElement: IonInput | IonButton | HTMLElement) {
        if (nextElement instanceof IonInput) {
            await nextElement.setFocus();
        } else if (nextElement instanceof IonButton) {
            // @ts-ignore
            nextElement.el.focus();
        }
    }

    async goTo(url: string) {
        await this.router.navigate([url]);
    }
}
