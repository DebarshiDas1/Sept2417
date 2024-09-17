import { TooltipService } from './tooltip.service';

describe('TooltipService', () => {
    let service: TooltipService;

    beforeEach(() => {
        service = new TooltipService();
    });

    describe('isTooltipDisabled', () => {
        it('should return true when scrollWidth is 0 and clientWidth is 0', () => {
            const elementMock: Partial<HTMLElement> = { scrollWidth: 0, clientWidth: 0 };
            const result = service.isTooltipDisabled(elementMock as HTMLElement);
            expect(result).toBeTrue();
        });

        it('should return true when scrollWidth is negative and clientWidth is positive', () => {
            const elementMock: Partial<HTMLElement> = { scrollWidth: -10, clientWidth: 20 };
            const result = service.isTooltipDisabled(elementMock as HTMLElement);
            expect(result).toBeTrue();
        });

        it('should return true when scrollWidth is positive and clientWidth is negative', () => {
            const elementMock: Partial<HTMLElement> = { scrollWidth: 10, clientWidth: -20 };
            const result = service.isTooltipDisabled(elementMock as HTMLElement);
            expect(result).not.toBeTrue();
        });

        it('should return false when scrollWidth is greater than clientWidth and both are positive', () => {
            const elementMock: Partial<HTMLElement> = { scrollWidth: 150, clientWidth: 100 };
            const result = service.isTooltipDisabled(elementMock as HTMLElement);
            expect(result).toBeFalse();
        });
    });
});
